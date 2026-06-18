#!/usr/bin/env node
/** MF-LX-04 — diccionario laboratorio CL demo + criticos. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const pkgDir = join(root, 'packages/lab-dictionary');
if (!existsSync(join(pkgDir, 'src/index.ts'))) {
  errors.push('Falta packages/lab-dictionary');
}

const seedSrc = readFileSync(join(pkgDir, 'src/labSeedEsCl.ts'), 'utf8');
for (const required of ['potasio', 'sodio', 'hemoglobina', 'pcr']) {
  if (!seedSrc.includes(`id: '${required}'`)) {
    errors.push(`labSeedEsCl falta ${required}`);
  }
}

const indexSrc = readFileSync(join(pkgDir, 'src/index.ts'), 'utf8');
for (const token of [
  'LAB_DICTIONARY',
  'searchLabsEsCl',
  'assessLabValue',
  'parseLabToken',
  'assertLabDictionaryInvariants',
]) {
  if (!indexSrc.includes(token)) {
    errors.push(`lab-dictionary/index.ts falta ${token}`);
  }
}

const vitest = spawnSync(
  'npx',
  ['vitest', 'run', 'packages/lab-dictionary/src/lab-dictionary.test.ts'],
  { cwd: root, encoding: 'utf8', shell: true },
);
if (vitest.status !== 0) {
  errors.push('lab-dictionary tests fallaron');
  if (vitest.stdout) process.stdout.write(vitest.stdout);
  if (vitest.stderr) process.stderr.write(vitest.stderr);
}

if (errors.length) {
  console.error('lab-dictionary-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('lab-dictionary-gate OK — laboratorio demo MF-LX-04');
