#!/usr/bin/env node
/**
 * Stack de laboratorio Evolab — NO es el arranque clínico normal.
 * FASE 2+: Postgres epis2_evolab + sandbox EPIS2 + Evolab doctor
 */
import { spawnSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const isWin = process.platform === 'win32';

function run(label, cmd, args) {
  console.log(`\n▶ ${label}`);
  const bin = isWin && cmd === 'npm' ? 'npm.cmd' : cmd;
  const result = spawnSync(bin, args, { stdio: 'inherit', cwd: ROOT, shell: isWin });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('EPIS2 evolab:stack — entorno de laboratorio\n');
run('sandbox EPIS2', 'npm', ['run', 'stack:dev']);
run('evolab db migrate', 'npm', ['run', 'evolab:db:migrate']);
run('evolab doctor', 'npm', ['run', 'evolab:doctor']);
console.log('\nevolab:stack OK — sandbox clínico + DB Evolab + verificación');
console.log('  Opcional: npm run evolab:console → http://127.0.0.1:5190');
