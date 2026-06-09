#!/usr/bin/env node
/** Validación interna Evolab — FASE 1 gates */
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../..');
const isWin = process.platform === 'win32';

function run(label, cmd, args) {
  console.log(`\n▶ ${label}`);
  const bin = isWin && cmd === 'npm' ? 'npm.cmd' : cmd;
  const result = spawnSync(bin, args, { stdio: 'inherit', cwd: ROOT, shell: isWin });
  if (result.status !== 0) {
    console.error(`\n✗ ${label} falló`);
    process.exit(result.status ?? 1);
  }
}

console.log('EPIS2 evolab:validate\n');
run('typecheck', 'npm', ['run', 'typecheck', '-w', '@epis2/evolution-lab']);
run('unit tests', 'npm', ['run', 'test', '-w', '@epis2/evolution-lab']);
run('boundary', 'node', ['scripts/evolution/boundary-validate.mjs']);
console.log('\nevolab:validate OK');
