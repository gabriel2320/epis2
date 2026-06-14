#!/usr/bin/env node
/** MF-SH-06 — db:validate incluye checksums Chile 035–040. */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'scripts/db/chile-migrations-checksums.json',
  'scripts/db/validate-chile-migrations.mjs',
  'reports/epis2-mf-sh-06-migration-control.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta: ${rel}`);
}

const dbValidate = spawnSync('npm', ['run', 'db:validate'], {
  cwd: root,
  shell: true,
  stdio: 'inherit',
});
if (dbValidate.status !== 0) errors.push('db:validate falló');

const vitest = spawnSync(
  'npx',
  ['vitest', 'run', 'database/tests/migration-chile-control.test.mjs'],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) errors.push('migration-chile-control.test falló');

if (errors.length) {
  console.error('sh-06-migration-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('sh-06-migration-gate OK — MF-SH-06');
