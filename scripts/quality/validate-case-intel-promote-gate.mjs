#!/usr/bin/env node
/**
 * MF-CASE-09: verifica pacientes EPIS2-SIM en SoT (requiere DATABASE_URL + migrate 042).
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import { readExpectedSimCatalogSize } from './lib/case-intel-expected.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
let EXPECTED;
try {
  EXPECTED = readExpectedSimCatalogSize();
} catch (err) {
  console.error('case-intel-promote-gate FAILED:\n  - ' + (err instanceof Error ? err.message : err));
  process.exit(1);
}
const errors = [];

function loadDatabaseUrl() {
  const envPath = join(root, '.env');
  if (!existsSync(envPath)) return process.env.DATABASE_URL;
  const text = readFileSync(envPath, 'utf8');
  for (const line of text.split(/\r?\n/)) {
    const match = line.match(/^\s*DATABASE_URL\s*=\s*(.*)\s*$/);
    if (match) return match[1].replace(/^['"]|['"]$/g, '');
  }
  return process.env.DATABASE_URL;
}

const catalogGate = spawnSync('node', ['tools/gates/run-legacy.mjs', 'quality:case-intel-catalog-gate'], {
  cwd: root,
  stdio: 'pipe',
  encoding: 'utf8',
});
if (catalogGate.status !== 0) {
  errors.push('quality:case-intel-catalog-gate falló (precondición fixtures)');
}

const databaseUrl = loadDatabaseUrl();
if (!databaseUrl) {
  console.warn('case-intel-promote-gate SKIP — sin DATABASE_URL (solo fixtures gate)');
  if (errors.length) {
    console.error('case-intel-promote-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }
  console.log('case-intel-promote-gate OK (fixtures only)');
  process.exit(0);
}

const verify = spawnSync(
  'npm',
  ['run', 'cli', '-w', '@epis2/clinical-case-intel', '--', 'verify-sim-seed'],
  {
    cwd: root,
    stdio: 'pipe',
    encoding: 'utf8',
    shell: true,
    env: { ...process.env, DATABASE_URL: databaseUrl },
  },
);

if (verify.status !== 0) {
  errors.push(`verify-sim-seed: ${(verify.stdout + verify.stderr).trim().slice(0, 500)}`);
  errors.push(`Se esperan ${EXPECTED} identificadores EPIS2-SIM — ejecutar: npm run db:migrate`);
}

if (errors.length) {
  console.error('case-intel-promote-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`case-intel-promote-gate OK — ${EXPECTED}+ pacientes SIM en SoT`);
