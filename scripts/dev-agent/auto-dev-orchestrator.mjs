#!/usr/bin/env node
/**
 * EPIS2-PM-03 — Orquestador 6 h: OpenClaw + Ollama + Evolab vía dev-cycle.
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
import { applyDevCycleEnv, runCycleBootstrap, runCycleClose, runTramoCycle } from './openclaw-dev-cycle.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const doCommit = args.includes('--commit');
const doPush = args.includes('--push');
const skipBootstrap = process.env.EPIS2_DEV_CYCLE_SKIP_BOOTSTRAP === '1';

const durationHours = Number(process.env.EPIS2_AUTO_DEV_DURATION_HOURS) || 6;
const pauseMs = Number(process.env.EPIS2_AUTO_DEV_TRAMO_PAUSE_MS) || 120_000;
const resume = process.env.EPIS2_AUTO_DEV_RESUME !== '0';
const openclawEnabled = process.env.EPIS2_AUTO_DEV_OPENCLAW === '1';
const evolabEnabled = process.env.EPIS2_AUTO_DEV_EVOLAB === '1';
const ollamaEnabled = process.env.EPIS2_AUTO_DEV_OLLAMA !== '0';

const ledgerPath = join(root, 'docs/quality/auto-dev-6h-ledger.json');
const logPath = join(root, 'reports/auto-dev-orchestrator-log.jsonl');

function log(event, detail = {}) {
  mkdirSync(join(root, 'reports'), { recursive: true });
  appendFileSync(logPath, `${JSON.stringify({ at: new Date().toISOString(), event, ...detail })}\n`, 'utf8');
}

async function pauseBetweenTramos(ms) {
  if (dryRun || ms <= 0) return;
  await sleepMs(ms);
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
  process.env = applyDevCycleEnv(process.env);

  console.log('EPIS2 dev:auto:orchestrate — PM-03 (dev-cycle)\n');
  console.log(`  Duración máx: ${durationHours} h · Pausa tramo: ${pauseMs} ms`);
  console.log(
    `  OpenClaw: ${openclawEnabled ? 'on' : 'off'} · Ollama: ${ollamaEnabled ? 'on' : 'off'} · Evolab: ${evolabEnabled ? 'on' : 'off'} · Resume: ${resume ? 'on' : 'off'}\n`,
  );

  if ((doCommit || doPush) && process.env.EPIS2_AUTO_DEV_AUTHORIZED !== '1') {
    console.error('Set EPIS2_AUTO_DEV_AUTHORIZED=1 para commit/push');
    process.exit(1);
  }

  if (!dryRun && !skipBootstrap) {
    const boot = runCycleBootstrap({ dryRun: false });
    if (!boot.ok) {
      log('bootstrap-failed', { stage: boot.stage });
      process.exit(1);
    }
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

    log('tramo-orchestrate', { order, id: tramo.id });
    const result = runTramoCycle({ order, dryRun, doCommit, ledger });

    if (!result.ok) {
      tramo.state = 'FAILED';
      saveLedger(ledger);
      log('tramo-orchestrate-failed', { order, stage: result.stage });
      if (!args.includes('--continue-on-fail')) process.exit(1);
      continue;
    }

    tramo.state = 'DONE';
    saveLedger(ledger);
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

  if (!dryRun && !skipBootstrap) {
    runCycleClose({ dryRun: false });
  }

  console.log('\ndev:auto:orchestrate OK');
  log('orchestrator-complete', { elapsedMs: elapsedMs(start) });
}

void main();
