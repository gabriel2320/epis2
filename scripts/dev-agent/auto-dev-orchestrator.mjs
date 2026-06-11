#!/usr/bin/env node
/**
 * EPIS2-PM-03 — Orquestador 6 h: Ollama + Cursor SDK + dev:auto:6h.
 *
 *   EPIS2_AUTO_DEV_AUTHORIZED=1 npm run dev:auto:orchestrate -- --commit --push
 *   npm run dev:auto:orchestrate -- --dry-run
 */
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { setTimeout as sleepMs } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const doCommit = args.includes('--commit');
const doPush = args.includes('--push');

const durationHours = Number(process.env.EPIS2_AUTO_DEV_DURATION_HOURS) || 6;
const pauseMs = Number(process.env.EPIS2_AUTO_DEV_TRAMO_PAUSE_MS) || 120_000;
const ollamaEnabled = process.env.EPIS2_AUTO_DEV_OLLAMA !== '0';
const ollamaApply = process.env.EPIS2_AUTO_DEV_OLLAMA_APPLY === '1';
const resume = process.env.EPIS2_AUTO_DEV_RESUME !== '0';

const ledgerPath = join(root, 'docs/quality/auto-dev-6h-ledger.json');
const logPath = join(root, 'reports/auto-dev-orchestrator-log.jsonl');

const TIER_X_TRAMOS = new Set([1, 2, 3, 4]);

function log(event, detail = {}) {
  mkdirSync(join(root, 'reports'), { recursive: true });
  appendFileSync(logPath, `${JSON.stringify({ at: new Date().toISOString(), event, ...detail })}\n`, 'utf8');
}

async function pauseBetweenTramos(ms) {
  if (dryRun || ms <= 0) return;
  await sleepMs(ms);
}

function runNode(rel, nodeArgs = []) {
  if (dryRun) {
    log('dry-run-node', { rel, nodeArgs });
    return { ok: true };
  }
  const r = spawnSync(process.execPath, [join(root, rel), ...nodeArgs], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    env: process.env,
  });
  return { ok: r.status === 0 };
}

function runNpm(script, extraArgs = []) {
  if (dryRun) {
    log('dry-run-npm', { script, extraArgs });
    return { ok: true };
  }
  const r = spawnSync('npm', ['run', script, ...extraArgs], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  return { ok: r.status === 0 };
}

function loadLedger() {
  return JSON.parse(readFileSync(ledgerPath, 'utf8'));
}

function saveLedger(ledger) {
  writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`, 'utf8');
}

function elapsedMs(start) {
  return Date.now() - start;
}

async function main() {
  console.log('EPIS2 dev:auto:orchestrate — PM-03\n');
  console.log(`  Duración máx: ${durationHours} h · Pausa tramo: ${pauseMs} ms`);
  console.log(`  Ollama: ${ollamaEnabled ? 'on' : 'off'} · Resume: ${resume ? 'on' : 'off'}\n`);

  if ((doCommit || doPush) && process.env.EPIS2_AUTO_DEV_AUTHORIZED !== '1') {
    console.error('Set EPIS2_AUTO_DEV_AUTHORIZED=1 para commit/push');
    process.exit(1);
  }

  if (!dryRun) {
    const pre = runNode('scripts/dev-agent/auto-dev-preconditions.mjs');
    if (!pre.ok) process.exit(1);
  }

  const start = Date.now();
  const maxMs = durationHours * 3600 * 1000;
  const ledger = loadLedger();
  const orders = ledger.tramos.map((t) => t.order).sort((a, b) => a - b);

  log('orchestrator-start', { durationHours, pauseMs, orders });

  for (const order of orders) {
    if (elapsedMs(start) >= maxMs) {
      console.log('\n⏱ Duración máxima alcanzada — deteniendo orquestador');
      log('duration-cap', { elapsedMs: elapsedMs(start) });
      break;
    }

    const tramo = ledger.tramos.find((t) => t.order === order);
    if (!tramo) continue;
    if (resume && tramo.state === 'DONE') {
      console.log(`\n⏭ Tramo ${order} ${tramo.id} — DONE (resume)`);
      continue;
    }
    if (tramo.state === 'FAILED' && !args.includes('--retry-failed')) {
      console.log(`\n⏭ Tramo ${order} FAILED — usar --retry-failed para reintentar`);
      continue;
    }

    console.log(`\n═══ Tramo ${order} — ${tramo.id}: ${tramo.name} ═══\n`);
    log('tramo-orchestrate', { order, id: tramo.id });

    if (TIER_X_TRAMOS.has(order)) {
      runNode('scripts/dev-agent/generate-auto-dev-cursor-prompt.mjs', ['--tramo', String(order)]);
      runNode('scripts/dev-agent/cursor-sdk-tramo.mjs', ['--tramo', String(order)]);
    }

    const runnerArgs = ['--', '--tramo', String(order)];
    if (doCommit) runnerArgs.push('--commit');
    if (ollamaEnabled && order === 0) runnerArgs.push('--ollama-auto');
    if (ollamaApply && order === 0) runnerArgs.push('--apply');

    if (!runNpm('dev:auto:6h', runnerArgs).ok) {
      tramo.state = 'FAILED';
      saveLedger(ledger);
      log('tramo-orchestrate-failed', { order });
      if (!args.includes('--continue-on-fail')) process.exit(1);
      continue;
    }

    if (ollamaEnabled && order > 0) {
      const ollamaArgs = ['--', '--skip-plan'];
      if (ollamaApply) ollamaArgs.push('--apply');
      runNpm('dev:agent:ollama-auto', ollamaArgs);
    }

    await pauseBetweenTramos(pauseMs);
  }

  if (doPush && process.env.EPIS2_AUTO_DEV_AUTHORIZED === '1' && !dryRun) {
    console.log('\n▶ Push final\n');
    const r = spawnSync('git', ['push', 'origin', 'master'], {
      cwd: root,
      stdio: 'inherit',
      shell: true,
    });
    if (r.status !== 0) process.exit(1);
    log('push', { ok: true });
  }

  const closePath = join(root, `reports/epis2-pm03-orchestrator-close-${new Date().toISOString().slice(0, 10)}.md`);
  if (!dryRun) {
    writeFileSync(
      closePath,
      `# Cierre PM-03 orquestador\n\n**Fin:** ${new Date().toISOString()}\n**Duración:** ${Math.round(elapsedMs(start) / 60000)} min\n\nLog: reports/auto-dev-orchestrator-log.jsonl\n`,
      'utf8',
    );
  }

  console.log('\ndev:auto:orchestrate OK');
  log('orchestrator-complete', { elapsedMs: elapsedMs(start) });
}

void main();
