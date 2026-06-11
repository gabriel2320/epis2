#!/usr/bin/env node
/**
 * EPIS2 — Proceso continuo coordinado (OpenClaw orquestador + Evolab complement).
 *
 *   EPIS2_AUTO_DEV_AUTHORIZED=1 npm run dev:auto:continuous -- --commit
 *
 * Sin solapamiento:
 *   - Track A: PM-03/OpenClaw secuencial por tramo (parallel launcher --no-evolve)
 *   - Track B: Evolab complement solo entre ciclos (orquestador idle)
 */
import { appendFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { setTimeout as sleepMs } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import {
  acquireSessionLock,
  printAlreadyRunning,
  releaseSessionLock,
} from './auto-dev-session-lock.mjs';
import { countPendingOrFailed, isLedgerCycleComplete, loadAutoDevLedger } from './auto-dev-ledger-lib.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const logPath = join(root, 'reports/auto-dev-continuous-log.jsonl');
const ledgerPath = join(root, 'docs/quality/auto-dev-6h-ledger.json');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const doCommit = args.includes('--commit');
const doPush = args.includes('--push');

const durationHours = Number(process.env.EPIS2_AUTO_DEV_DURATION_HOURS) || 6;
const cyclePauseMs = Number(process.env.EPIS2_AUTO_DEV_CYCLE_PAUSE_MS) || 120_000;
const maxMs = durationHours * 3600 * 1000;
let lockHeld = false;

function log(event, detail = {}) {
  mkdirSync(join(root, 'reports'), { recursive: true });
  appendFileSync(logPath, `${JSON.stringify({ at: new Date().toISOString(), event, ...detail })}\n`, 'utf8');
}

function resetStuckTramos() {
  const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));
  let changed = false;
  for (const tramo of ledger.tramos) {
    if (tramo.state === 'RUNNING') {
      tramo.state = 'FAILED';
      changed = true;
    }
  }
  if (changed) writeFileSync(ledgerPath, `${JSON.stringify(ledger, null, 2)}\n`, 'utf8');
}

function pendingOrFailedCount() {
  return countPendingOrFailed(loadAutoDevLedger(root));
}

async function ensureApiUp() {
  try {
    const r = await fetch('http://127.0.0.1:3001/health', { signal: AbortSignal.timeout(3000) });
    if (r.ok) return true;
  } catch {
    /* fall through */
  }
  console.log('\n▶ API caída — arrancando dev:api\n');
  spawnSync('npm', ['run', 'dev:api'], {
    cwd: root,
    detached: true,
    stdio: 'ignore',
    shell: true,
    env: process.env,
  });
  for (let i = 0; i < 15; i += 1) {
    await sleepMs(2000);
    try {
      const r = await fetch('http://127.0.0.1:3001/health', { signal: AbortSignal.timeout(3000) });
      if (r.ok) return true;
    } catch {
      /* retry */
    }
  }
  return false;
}

function runOrchestratorCycle(cycle) {
  const cycleArgs = [
    'scripts/dev-agent/auto-dev-parallel-launcher.mjs',
    '--continue-on-fail',
    '--retry-failed',
    '--no-evolve',
  ];
  if (doCommit) cycleArgs.push('--commit');
  if (doPush) cycleArgs.push('--push');
  if (dryRun) cycleArgs.push('--dry-run');

  log('continuous-orchestrator-start', { cycle, args: cycleArgs });
  console.log(`\n═══ Ciclo ${cycle} — Track A: OpenClaw + PM-03 ═══\n`);

  if (dryRun) return { ok: true, status: 0 };

  const r = spawnSync(process.execPath, cycleArgs, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    env: {
      ...process.env,
      EPIS2_AUTO_DEV_PARALLEL_SKIP_LOCK: '1',
      EPIS2_EVOLAB_PARALLEL_EVOLVE: '0',
      EPIS2_DEV_CYCLE_SKIP_BOOTSTRAP: cycle > 1 ? '1' : process.env.EPIS2_DEV_CYCLE_SKIP_BOOTSTRAP ?? '0',
    },
  });
  log('continuous-orchestrator-end', { cycle, status: r.status });
  return { ok: r.status === 0, status: r.status ?? 1 };
}

function runEvolabComplement(cycle) {
  if (process.env.EPIS2_AUTO_DEV_EVOLAB !== '1') return { ok: true };
  log('continuous-complement-start', { cycle });
  console.log(`\n═══ Ciclo ${cycle} — Track B: Evolab complement (idle) ═══\n`);
  if (dryRun) return { ok: true };
  const r = spawnSync(process.execPath, ['scripts/dev-agent/evolab-complement.mjs'], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    env: process.env,
  });
  log('continuous-complement-end', { cycle, status: r.status });
  return { ok: r.status === 0, status: r.status ?? 1 };
}

async function main() {
  const lock = acquireSessionLock({
    root,
    cmd: `node scripts/dev-agent/auto-dev-continuous.mjs ${args.join(' ')}`.trim(),
    mode: 'continuous',
    dryRun,
  });
  if (!lock.acquired) {
    if (lock.lock) printAlreadyRunning(lock.lock);
    process.exit(0);
  }
  lockHeld = true;

  const cleanup = (code) => {
    if (lockHeld) releaseSessionLock(root);
    process.exit(code);
  };
  process.on('exit', () => {
    if (lockHeld) releaseSessionLock(root);
  });
  process.on('SIGINT', () => cleanup(130));
  process.on('SIGTERM', () => cleanup(143));

  if ((doCommit || doPush) && process.env.EPIS2_AUTO_DEV_AUTHORIZED !== '1') {
    console.error('Set EPIS2_AUTO_DEV_AUTHORIZED=1 para commit/push');
    cleanup(1);
  }

  console.log(`EPIS2 dev:auto:continuous — coordinado ${durationHours}h\n`);
  console.log('  Track A: OpenClaw + PM-03 (secuencial, sin evolve paralelo)');
  console.log('  Track B: Evolab complement entre ciclos\n');
  log('continuous-start', { durationHours, cyclePauseMs, doCommit, doPush, coordinated: true });

  resetStuckTramos();
  if (!dryRun && !(await ensureApiUp())) {
    console.error('[FAIL] API :3001 no disponible');
    cleanup(1);
  }

  const ledgerAtStart = loadAutoDevLedger(root);
  if (isLedgerCycleComplete(ledgerAtStart, { retryFailed: true })) {
    console.log('\n✓ Ledger auto-dev completo — continuous no inicia bucles vacíos\n');
    console.log('  Resetea docs/quality/auto-dev-6h-ledger.json o usa dev:auto:orchestrate --retry-failed\n');
    log('continuous-idle-exit', { reason: 'ledger-complete-at-start' });
    cleanup(0);
  }

  const start = Date.now();
  let cycle = 0;

  while (Date.now() - start < maxMs) {
    cycle += 1;
    const ledgerBefore = loadAutoDevLedger(root);
    if (isLedgerCycleComplete(ledgerBefore, { retryFailed: true })) {
      console.log('\n✓ Todos los tramos completos — deteniendo continuous (anti-bucle vacío)\n');
      log('continuous-idle-exit', { cycle, reason: 'ledger-complete', elapsedMs: Date.now() - start });
      break;
    }

    runOrchestratorCycle(cycle);
    runEvolabComplement(cycle);

    const remaining = pendingOrFailedCount();
    log('continuous-status', { cycle, remaining, elapsedMs: Date.now() - start });
    if (remaining === 0) {
      console.log('\n✓ Todos los tramos DONE — deteniendo continuous\n');
      log('continuous-idle-exit', { cycle, reason: 'no-pending-or-failed', elapsedMs: Date.now() - start });
      break;
    }

    if (Date.now() - start >= maxMs) break;
    console.log(`\n⏸ Pausa ${cyclePauseMs}ms (sin choques)…\n`);
    await sleepMs(cyclePauseMs);
  }

  log('continuous-complete', { cycles: cycle, elapsedMs: Date.now() - start });
  console.log(`\ndev:auto:continuous OK — ${cycle} ciclo(s)`);
  console.log(`Log: ${logPath}`);
  cleanup(0);
}

void main();
