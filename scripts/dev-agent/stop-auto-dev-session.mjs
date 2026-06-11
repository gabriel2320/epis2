#!/usr/bin/env node
/**
 * Detiene sesiones auto-dev y limpia locks stale.
 *   npm run dev:auto:stop
 */
import { existsSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { isPidAlive, lockPath, readActiveLock } from './auto-dev-session-lock.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const legacyLocks = [
  join(root, 'reports/auto-dev-continuous.lock'),
  join(root, 'reports/auto-dev-parallel.lock'),
];

function killPid(pid, label) {
  if (!isPidAlive(pid)) return false;
  try {
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore', shell: true });
    } else {
      process.kill(pid, 'SIGTERM');
    }
    console.log(`  terminado ${label} PID ${pid}`);
    return true;
  } catch {
    return false;
  }
}

function removeLock(path) {
  if (existsSync(path)) {
    unlinkSync(path);
    console.log(`  lock eliminado ${path}`);
  }
}

const lock = readActiveLock(root);
if (lock) {
  console.log('\n▶ Sesión auto-dev activa detectada\n');
  killPid(lock.pid, lock.mode ?? 'session');
  if (lock.children?.orchestratorPid) killPid(lock.children.orchestratorPid, 'orchestrator');
  if (lock.children?.evolvePid) killPid(lock.children.evolvePid, 'evolab-evolve');
  removeLock(lockPath(root));
} else {
  console.log('\n▶ Sin lock JSON activo\n');
}

for (const p of legacyLocks) removeLock(p);

console.log('\ndev:auto:stop OK\n');
