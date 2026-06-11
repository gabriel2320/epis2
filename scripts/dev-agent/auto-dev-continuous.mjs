#!/usr/bin/env node
/**
 * EPIS2 — Proceso continuo integrado (ciclos PM-03 + Evolab hasta tope horas).
 *
 *   EPIS2_AUTO_DEV_AUTHORIZED=1 npm run dev:auto:continuous -- --commit
 */
import { appendFileSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { setTimeout as sleepMs } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const logPath = join(root, 'reports/auto-dev-continuous-log.jsonl');
const lockPath = join(root, 'reports/auto-dev-continuous.lock');
const ledgerPath = join(root, 'docs/quality/auto-dev-6h-ledger.json');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const doCommit = args.includes('--commit');
const doPush = args.includes('--push');

const durationHours = Number(process.env.EPIS2_AUTO_DEV_DURATION_HOURS) || 6;
const cyclePauseMs = Number(process.env.EPIS2_AUTO_DEV_CYCLE_PAUSE_MS) || 180_000;
const maxMs = durationHours * 3600 * 1000;

function log(event, detail = {}) {
  mkdirSync(join(root, 'reports'), { recursive: true });
  appendFileSync(logPath, `${JSON.stringify({ at: new Date().toISOString(), event, ...detail })}\n`, 'utf8');
}

function isPidAlive(pid) {
  if (!pid || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function acquireLock() {
  if (dryRun) return;
  mkdirSync(join(root, 'reports'), { recursive: true });
  if (existsSync(lockPath)) {
    try {
      const existing = JSON.parse(readFileSync(lockPath, 'utf8'));
      if (isPidAlive(existing.pid)) {
        console.log(`\n[INFO] dev:auto:continuous ya activo (PID ${existing.pid})\n`);
        process.exit(0);
      }
    } catch {
      /* overwrite */
    }
  }
  writeFileSync(
    lockPath,
    `${JSON.stringify({ pid: process.pid, at: new Date().toISOString() })}\n`,
    'utf8',
  );
}

function releaseLock() {
  if (dryRun || !existsSync(lockPath)) return;
  try {
    const existing = JSON.parse(readFileSync(lockPath, 'utf8'));
    if (existing.pid === process.pid) unlinkSync(lockPath);
  } catch {
    /* ignore */
  }
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
  const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));
  return ledger.tramos.filter((t) => t.state === 'FAILED' || t.state === 'PENDING').length;
}

async function ensureApiUp() {
  try {
    const r = await fetch('http://127.0.0.1:3001/health', { signal: AbortSignal.timeout(3000) });
    if (r.ok) return true;
  } catch {
    /* fall through */
  }
  console.log('\n▶ API caída — ejecutando dev:api en background (stack parcial)\n');
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

function runCycle(cycle, { withEvolve }) {
  const cycleArgs = [
    'scripts/dev-agent/auto-dev-parallel-launcher.mjs',
    '--continue-on-fail',
    '--retry-failed',
  ];
  if (doCommit) cycleArgs.push('--commit');
  if (doPush) cycleArgs.push('--push');
  if (!withEvolve) cycleArgs.push('--no-evolve');
  if (dryRun) cycleArgs.push('--dry-run');

  log('continuous-cycle-start', { cycle, withEvolve, args: cycleArgs });
  console.log(`\n═══ Ciclo continuo ${cycle} ═══\n`);

  if (dryRun) return { ok: true, status: 0 };

  const r = spawnSync(process.execPath, cycleArgs, {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    env: { ...process.env, EPIS2_AUTO_DEV_PARALLEL_SKIP_LOCK: '1' },
  });
  log('continuous-cycle-end', { cycle, status: r.status });
  return { ok: r.status === 0, status: r.status ?? 1 };
}

async function main() {
  acquireLock();
  process.on('exit', releaseLock);
  process.on('SIGINT', () => {
    releaseLock();
    process.exit(130);
  });

  if ((doCommit || doPush) && process.env.EPIS2_AUTO_DEV_AUTHORIZED !== '1') {
    console.error('Set EPIS2_AUTO_DEV_AUTHORIZED=1 para commit/push');
    process.exit(1);
  }

  console.log(`EPIS2 dev:auto:continuous — ${durationHours}h · pausa ciclo ${cyclePauseMs}ms\n`);
  log('continuous-start', { durationHours, cyclePauseMs, doCommit, doPush });

  resetStuckTramos();
  const apiOk = await ensureApiUp();
  if (!apiOk) {
    console.error('[FAIL] API :3001 no disponible');
    process.exit(1);
  }

  const start = Date.now();
  let cycle = 0;

  while (Date.now() - start < maxMs) {
    cycle += 1;
    runCycle(cycle, { withEvolve: cycle === 1 });

    const remaining = pendingOrFailedCount();
    log('continuous-status', { cycle, remaining, elapsedMs: Date.now() - start });
    if (remaining === 0) {
      console.log('\n✓ Todos los tramos DONE — ciclo continuo sigue hasta tope horas\n');
    }

    if (Date.now() - start >= maxMs) break;
    console.log(`\n⏸ Pausa ${cyclePauseMs}ms antes del siguiente ciclo…\n`);
    await sleepMs(cyclePauseMs);
  }

  log('continuous-complete', { cycles: cycle, elapsedMs: Date.now() - start });
  console.log(`\ndev:auto:continuous OK — ${cycle} ciclo(s)`);
  console.log(`Log: ${logPath}`);
}

void main();
