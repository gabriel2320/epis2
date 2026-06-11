/**
 * Candado single-instance para sesiones auto-dev (parallel / cycle / orchestrate).
 *
 * Lock: reports/auto-dev-parallel.lock.json
 * - Adquisición atómica (wx) para evitar carreras entre lanzadores.
 * - Si el PID del lock está muerto, se considera stale y se re-adquiere.
 * - Duplicado detectado → mensaje claro + exit 0 (no error).
 */
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const defaultRoot = join(dirname(fileURLToPath(import.meta.url)), '../..');

export const LOCK_REL = 'reports/auto-dev-parallel.lock.json';

export function lockPath(root = defaultRoot) {
  return join(root, LOCK_REL);
}

export function isPidAlive(pid) {
  if (!pid || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function parseLock(raw) {
  return JSON.parse(raw);
}

/** Lee lock activo o elimina stale/corrupto. */
export function readActiveLock(root = defaultRoot) {
  const path = lockPath(root);
  if (!existsSync(path)) return null;
  try {
    const lock = parseLock(readFileSync(path, 'utf8'));
    if (isPidAlive(lock.pid)) return lock;
    unlinkSync(path);
    return null;
  } catch {
    try {
      unlinkSync(path);
    } catch {
      /* ignore */
    }
    return null;
  }
}

export function printAlreadyRunning(lock, root = defaultRoot) {
  const startedAt = lock.startedAt ?? lock.at ?? '?';
  console.log('\n[INFO] Sesión auto-dev ya en ejecución — no se inicia una segunda instancia.');
  console.log(`  PID:        ${lock.pid}`);
  console.log(`  Modo:       ${lock.mode ?? 'parallel'}`);
  console.log(`  Inicio:     ${startedAt}`);
  console.log(`  Comando:    ${lock.cmd ?? '?'}`);
  if (lock.children?.orchestratorPid) {
    console.log(`  Orquestador: ${lock.children.orchestratorPid}`);
  }
  if (lock.children?.evolvePid) {
    console.log(`  Evolab evolve: ${lock.children.evolvePid}`);
  }
  console.log(`  Lock:       ${lockPath(root)}\n`);
}

/**
 * @returns {{ acquired: boolean, lock?: object, stale?: boolean }}
 */
export function acquireSessionLock({
  root = defaultRoot,
  pid = process.pid,
  cmd = '',
  mode = 'parallel',
  children = {},
  dryRun = false,
} = {}) {
  if (dryRun) return { acquired: true };

  mkdirSync(join(root, 'reports'), { recursive: true });
  const path = lockPath(root);

  const active = readActiveLock(root);
  if (active && active.pid !== pid) {
    return { acquired: false, lock: active };
  }

  const lock = {
    pid,
    startedAt: new Date().toISOString(),
    cmd,
    mode,
    children,
  };

  try {
    writeFileSync(path, `${JSON.stringify(lock)}\n`, { flag: 'wx' });
    return { acquired: true, lock };
  } catch (err) {
    if (err?.code !== 'EEXIST') throw err;
    const again = readActiveLock(root);
    if (again && again.pid !== pid) return { acquired: false, lock: again };
    try {
      writeFileSync(path, `${JSON.stringify(lock)}\n`, { flag: 'wx' });
      return { acquired: true, lock };
    } catch {
      const final = readActiveLock(root);
      return { acquired: false, lock: final ?? undefined };
    }
  }
}

export function updateSessionLockChildren(root, patch, pid = process.pid) {
  const path = lockPath(root);
  if (!existsSync(path)) return;
  try {
    const lock = parseLock(readFileSync(path, 'utf8'));
    if (lock.pid !== pid) return;
    lock.children = { ...(lock.children ?? {}), ...patch };
    writeFileSync(path, `${JSON.stringify(lock)}\n`);
  } catch {
    /* ignore */
  }
}

export function releaseSessionLock(root = defaultRoot, pid = process.pid) {
  const path = lockPath(root);
  if (!existsSync(path)) return;
  try {
    const lock = parseLock(readFileSync(path, 'utf8'));
    if (lock.pid === pid) unlinkSync(path);
  } catch {
    /* ignore */
  }
}

/** Sale con exitCode si hay sesión activa (p. ej. dev:auto:cycle antes de bootstrap). */
export function exitIfSessionActive(root = defaultRoot, { exitCode = 0, logFn } = {}) {
  const lock = readActiveLock(root);
  if (!lock) return false;
  printAlreadyRunning(lock);
  logFn?.('session-already-running', { pid: lock.pid, mode: lock.mode, cmd: lock.cmd });
  process.exit(exitCode);
}
