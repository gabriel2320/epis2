#!/usr/bin/env node
/** Semana 1 — scripts stack dev local (Windows + Node). */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'scripts/stack-dev.mjs',
  'scripts/stack-dev.ps1',
  'scripts/stack-reset.mjs',
  'scripts/stack-reset.ps1',
  'scripts/db-url.mjs',
  'scripts/ai-evals-live.mjs',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta ${rel}`);
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
for (const script of ['stack:dev', 'stack:reset', 'ai:evals:live', 'quality:dev-env-gate']) {
  if (!pkg.includes(`"${script}"`)) errors.push(`package.json sin ${script}`);
}

const migrate = readFileSync(join(root, 'scripts/db-migrate.mjs'), 'utf8');
if (!migrate.includes('resolveMigrateDatabaseUrl')) {
  errors.push('db-migrate.mjs sin auto-derive superuser');
}

if (errors.length) {
  console.error('stack-dev-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('stack-dev-gate OK — automatización Semana 1 presente');
