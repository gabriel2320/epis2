#!/usr/bin/env node
/**
 * EPIS2 OpenClaw — ejecuta comando allowlist bajo candados.
 *
 *   npm run openclaw:safe-run -- --cmd "npm run check"
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { isAllowedCommand, resolveOpenClawLocks } from './openclaw-policy.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const cmdIdx = args.indexOf('--cmd');
const cmd = cmdIdx >= 0 ? args[cmdIdx + 1] : null;

if (!cmd) {
  console.error('Uso: openclaw-safe-run.mjs --cmd "npm run check"');
  process.exit(1);
}

const locks = resolveOpenClawLocks();
const check = isAllowedCommand(cmd, locks);

if (!check.allowed) {
  console.error(`[FAIL] openclaw:safe-run bloqueado: ${check.reason}`);
  process.exit(1);
}

console.log(`openclaw:safe-run OK (${locks.level}/${locks.profile}) → ${cmd}\n`);

const isNpmRun = /^npm run /i.test(cmd);
let status = 1;

if (isNpmRun) {
  const rest = cmd.replace(/^npm run /i, '').trim();
  const [script, ...npmExtra] = rest.split(' -- ');
  const npmArgs = ['run', script.trim()];
  if (npmExtra.length) npmArgs.push('--', ...npmExtra.join(' -- ').split(' ').filter(Boolean));
  const r = spawnSync('npm', npmArgs, {
    cwd: root,
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });
  status = r.status ?? 1;
} else if (cmd.startsWith('git ')) {
  const r = spawnSync(cmd, { cwd: root, stdio: 'inherit', shell: true, env: process.env });
  status = r.status ?? 1;
} else {
  const r = spawnSync(cmd, { cwd: root, stdio: 'inherit', shell: true, env: process.env });
  status = r.status ?? 1;
}

process.exit(status);
