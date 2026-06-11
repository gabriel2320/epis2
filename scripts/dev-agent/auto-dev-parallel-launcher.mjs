#!/usr/bin/env node
/**
 * EPIS2-PM-03 — Lanzador paralelo integrado (orquestador + Evolab evolve).
 *
 *   EPIS2_AUTO_DEV_AUTHORIZED=1 EPIS2_AUTO_DEV_EVOLAB=1 EPIS2_AUTO_DEV_PARALLEL=1 \
 *     npm run dev:auto:parallel -- --commit [--push] [--continue-on-fail]
 *
 * Candado: reports/auto-dev-parallel.lock.json (single-instance, stale-safe).
 */
import { appendFileSync, createWriteStream, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { applyDevCycleEnv } from './openclaw-dev-cycle.mjs';
import { openClawSafetyEnv } from './openclaw-policy.mjs';
import {
  acquireSessionLock,
  printAlreadyRunning,
  releaseSessionLock,
  updateSessionLockChildren,
} from './auto-dev-session-lock.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const logPath = join(root, 'reports/auto-dev-parallel-log.jsonl');
const args = process.argv.slice(2);
let evolveChild = null;
let lockHeld = false;
const dryRun = args.includes('--dry-run');
const doCommit = args.includes('--commit');
const doPush = args.includes('--push');
const continueOnFail = args.includes('--continue-on-fail') || process.env.EPIS2_AUTO_DEV_PARALLEL !== '0';
const retryFailed = args.includes('--retry-failed');
const skipEvolve =
  args.includes('--no-evolve') ||
  process.env.EPIS2_AUTO_DEV_EVOLAB !== '1' ||
  process.env.EPIS2_EVOLAB_PARALLEL_EVOLVE !== '1';

const evolveGenerations = process.env.EPIS2_EVOLAB_EVOLVE_GENERATIONS ?? '2';
const evolveBudgetMinutes = process.env.EPIS2_EVOLAB_EVOLVE_BUDGET_MINUTES ?? '300';

function launcherCmd() {
  return `node scripts/dev-agent/auto-dev-parallel-launcher.mjs ${args.join(' ')}`.trim();
}

/** Env de seguridad compartido para procesos Evolab + OpenClaw. */
function safetyEnv(extra = {}) {
  const base = {
    ...process.env,
    ...extra,
    EPIS2_ROOT: root,
    EPIS2_EVOLAB_PATCHING_ENABLED: 'false',
    EPIS2_EVOLAB_REQUIRE_HUMAN_APPROVAL: 'true',
    EPIS2_EVOLAB_LLM_CONCURRENCY: process.env.EPIS2_EVOLAB_LLM_CONCURRENCY ?? '1',
    EPIS2_AUTO_DEV_TRAMO_PAUSE_MS: process.env.EPIS2_AUTO_DEV_TRAMO_PAUSE_MS ?? '120000',
  };
  if (process.env.EPIS2_AUTO_DEV_OPENCLAW === '1' && process.env.EPIS2_AUTO_DEV_EVOLAB === '1') {
    return applyDevCycleEnv(base);
  }
  return openClawSafetyEnv(base);
}

function log(event, detail = {}) {
  mkdirSync(join(root, 'reports'), { recursive: true });
  appendFileSync(logPath, `${JSON.stringify({ at: new Date().toISOString(), event, ...detail })}\n`, 'utf8');
}

const skipSessionLock = process.env.EPIS2_AUTO_DEV_PARALLEL_SKIP_LOCK === '1';

function tryAcquireLock() {
  if (skipSessionLock) {
    log('parallel-lock-skipped', { reason: 'EPIS2_AUTO_DEV_PARALLEL_SKIP_LOCK=1' });
    return;
  }
  const result = acquireSessionLock({
    root,
    cmd: launcherCmd(),
    mode: 'parallel',
    dryRun,
  });
  if (!result.acquired) {
    if (result.lock) {
      printAlreadyRunning(result.lock);
      log('parallel-already-running', {
        pid: result.lock.pid,
        startedAt: result.lock.startedAt,
        cmd: result.lock.cmd,
        mode: result.lock.mode,
      });
    } else {
      log('parallel-lock-contested', {});
      console.log('\n[INFO] Otra instancia adquirió el lock — saliendo.\n');
    }
    process.exit(0);
  }
  lockHeld = true;
  log('parallel-lock-acquired', { pid: process.pid, cmd: launcherCmd() });
}

function cleanupAndExit(code) {
  if (evolveChild) killChild(evolveChild, 'evolab-evolve');
  if (lockHeld && !skipSessionLock) releaseSessionLock(root);
  process.exit(code);
}

async function isOllamaUp() {
  const base = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
  try {
    const r = await fetch(`${base}/api/tags`, { signal: AbortSignal.timeout(4000) });
    return r.ok;
  } catch {
    return false;
  }
}

async function isStackReady() {
  const ollamaUp = await isOllamaUp();
  let apiUp = false;
  try {
    const r = await fetch('http://127.0.0.1:3001/health', { signal: AbortSignal.timeout(3000) });
    apiUp = r.ok;
  } catch {
    apiUp = false;
  }
  return { ollamaUp, apiUp, ready: ollamaUp && apiUp };
}

function runSyncNpm(script, extraArgs = [], { env = process.env } = {}) {
  if (dryRun) {
    log('dry-run-npm', { script, extraArgs });
    return { ok: true, status: 0 };
  }
  const r = spawnSync('npm', ['run', script, ...extraArgs], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env,
  });
  return { ok: r.status === 0, status: r.status ?? 1 };
}

function runSyncNode(rel, nodeArgs = [], { env = process.env } = {}) {
  if (dryRun) {
    log('dry-run-node', { rel, nodeArgs });
    return { ok: true, status: 0 };
  }
  const r = spawnSync(process.execPath, [join(root, rel), ...nodeArgs], {
    cwd: root,
    stdio: 'inherit',
    shell: false,
    env,
  });
  return { ok: r.status === 0, status: r.status ?? 1 };
}

function spawnDetached(label, cmd, cmdArgs, { env = process.env, logFile } = {}) {
  if (dryRun) {
    log('dry-run-spawn', { label, cmd, cmdArgs });
    return null;
  }
  const child = spawn(cmd, cmdArgs, {
    cwd: root,
    detached: true,
    stdio: logFile ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    shell: false,
    env,
  });
  if (logFile && child.stdout && child.stderr) {
    const out = createWriteStream(logFile, { flags: 'a' });
    child.stdout.pipe(out);
    child.stderr.pipe(out);
  }
  child.unref();
  log('spawn-detached', { label, pid: child.pid, cmd: `${cmd} ${cmdArgs.join(' ')}` });
  return child;
}

function spawnOrchestrator() {
  const orchArgs = ['run', 'dev:auto:orchestrate', '--'];
  if (doCommit) orchArgs.push('--commit');
  if (doPush) orchArgs.push('--push');
  if (continueOnFail) orchArgs.push('--continue-on-fail');
  if (retryFailed) orchArgs.push('--retry-failed');
  if (dryRun) orchArgs.push('--dry-run');

  if (dryRun) {
    log('dry-run-orchestrator', { orchArgs });
    return Promise.resolve({ ok: true, status: 0, pid: null });
  }

  return new Promise((resolve) => {
    const child = spawn('npm', orchArgs, {
      cwd: root,
      stdio: 'inherit',
      shell: true,
      env: safetyEnv({
        EPIS2_AUTO_DEV_UNDER_PARALLEL: '1',
        EPIS2_DEV_CYCLE_SKIP_BOOTSTRAP: '1',
      }),
    });
    log('spawn-orchestrator', { pid: child.pid, args: orchArgs });
    updateSessionLockChildren(root, { orchestratorPid: child.pid });
    child.on('close', (code) => {
      log('orchestrator-exit', { pid: child.pid, code });
      resolve({ ok: code === 0, status: code ?? 1, pid: child.pid });
    });
    child.on('error', (err) => {
      log('orchestrator-error', { message: err.message });
      resolve({ ok: false, status: 1, pid: child.pid });
    });
  });
}

function killChild(child, label) {
  if (!child?.pid) return;
  try {
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { stdio: 'ignore', shell: true });
    } else {
      process.kill(-child.pid, 'SIGTERM');
    }
    log('kill-child', { label, pid: child.pid });
  } catch (err) {
    log('kill-child-failed', { label, pid: child.pid, message: err.message });
  }
}

async function main() {
  tryAcquireLock();
  process.on('SIGINT', () => cleanupAndExit(130));
  process.on('SIGTERM', () => cleanupAndExit(143));

  console.log('EPIS2 dev:auto:parallel — sesión integrada PM-03 + Evolab\n');
  console.log('  Seguridad: patching=off · human approval=on · LLM concurrency=1');
  const evolveMode =
    skipEvolve ? 'off (complement entre ciclos)' : `on paralelo (${evolveGenerations} gen, ${evolveBudgetMinutes} min)`;
  console.log(`  Evolab evolve: ${evolveMode}\n`);

  if ((doCommit || doPush) && process.env.EPIS2_AUTO_DEV_AUTHORIZED !== '1') {
    console.error('Set EPIS2_AUTO_DEV_AUTHORIZED=1 para commit/push');
    cleanupAndExit(1);
  }

  log('parallel-start', {
    doCommit,
    doPush,
    continueOnFail,
    skipEvolve,
    evolveGenerations,
    evolveBudgetMinutes,
    env: {
      EPIS2_EVOLAB_PATCHING_ENABLED: 'false',
      EPIS2_EVOLAB_REQUIRE_HUMAN_APPROVAL: 'true',
      EPIS2_EVOLAB_LLM_CONCURRENCY: safetyEnv().EPIS2_EVOLAB_LLM_CONCURRENCY,
      EPIS2_AUTO_DEV_TRAMO_PAUSE_MS: safetyEnv().EPIS2_AUTO_DEV_TRAMO_PAUSE_MS,
    },
  });

  if (!dryRun) {
    const stack = await isStackReady();
    if (!stack.ready) {
      console.log(
        `\n▶ Stack incompleto (ollama=${stack.ollamaUp}, api=${stack.apiUp}) — ejecutando stack:dev\n`,
      );
      log('stack-dev-start', { ollamaUp: stack.ollamaUp, apiUp: stack.apiUp });
      const stackRun = runSyncNpm('stack:dev');
      if (!stackRun.ok) {
        log('stack-dev-failed', {});
        cleanupAndExit(1);
      }
      log('stack-dev-ok', {});
    } else {
      console.log('  [OK] Stack activo (Ollama + API)\n');
      log('stack-skipped', { reason: 'stack-ready' });
    }

    const pre = runSyncNode('scripts/dev-agent/auto-dev-preconditions.mjs', [], { env: safetyEnv() });
    if (!pre.ok) {
      log('preconditions-failed', {});
      cleanupAndExit(1);
    }

    if (process.env.EPIS2_AUTO_DEV_EVOLAB === '1') {
      console.log('\n▶ evolab:doctor\n');
      const doctor = runSyncNpm('evolab:doctor', [], { env: safetyEnv() });
      if (!doctor.ok) {
        log('evolab-doctor-failed', {});
        cleanupAndExit(1);
      }
    }

    if (process.env.EPIS2_AUTO_DEV_OPENCLAW === '1') {
      console.log('\n▶ openclaw:policy + dev:openclaw:sync (inicio)\n');
      const policy = runSyncNpm('openclaw:policy', [], { env: safetyEnv() });
      if (!policy.ok) {
        log('openclaw-policy-failed', {});
        cleanupAndExit(1);
      }
      runSyncNpm('dev:openclaw:sync', [], { env: safetyEnv() });
    }

    console.log('\n▶ dev:evolab:sync (inicio)\n');
    runSyncNpm('dev:evolab:sync', [], { env: safetyEnv() });
  }

  if (!skipEvolve) {
    const evolveLog = join(root, 'reports/evolab-evolve-parallel.log');
    const evolveArgs = [
      'scripts/dev-agent/evolab-bridge.mjs',
      'evolve',
      '--generations',
      evolveGenerations,
      '--budget-minutes',
      evolveBudgetMinutes,
      '--json',
    ];
    console.log(`\n▶ Evolab evolve (background) → ${evolveLog}\n`);
    evolveChild = spawnDetached('evolab-evolve', process.execPath, evolveArgs, {
      env: safetyEnv(),
      logFile: evolveLog,
    });
    if (evolveChild) {
      log('evolab-evolve-start', { pid: evolveChild.pid, evolveLog });
      updateSessionLockChildren(root, { evolvePid: evolveChild.pid });
    }
  }

  console.log('\n▶ PM-03 orquestador (track principal)\n');
  const orch = await spawnOrchestrator();

  if (evolveChild) {
    console.log('\n▶ Deteniendo Evolab evolve (orquestador finalizado)\n');
    killChild(evolveChild, 'evolab-evolve');
    evolveChild = null;
  }

  if (!dryRun && process.env.EPIS2_AUTO_DEV_EVOLAB === '1') {
    console.log('\n▶ evolab:validate + dev:evolab:sync (cierre)\n');
    runSyncNpm('evolab:validate', [], { env: safetyEnv() });
    runSyncNpm('dev:evolab:sync', [], { env: safetyEnv() });
  }

  if (!dryRun && process.env.EPIS2_AUTO_DEV_OPENCLAW === '1') {
    console.log('\n▶ dev:openclaw:sync (cierre)\n');
    runSyncNpm('dev:openclaw:sync', [], { env: safetyEnv() });
  }

  log('parallel-complete', { orchestratorOk: orch.ok, orchestratorStatus: orch.status, continueOnFail });

  if (!orch.ok && !continueOnFail) {
    console.error('\ndev:auto:parallel FAILED — orquestador PM-03 terminó con error');
    cleanupAndExit(orch.status || 1);
  }
  if (!orch.ok && continueOnFail) {
    console.warn('\n[WARN] Orquestador terminó con error — continue-on-fail activo (revisar logs)');
  }

  console.log('\ndev:auto:parallel OK');
  console.log(`Log: ${logPath}`);
  cleanupAndExit(0);
}

void main().catch((err) => {
  console.error('dev:auto:parallel FAILED', err);
  cleanupAndExit(1);
});
