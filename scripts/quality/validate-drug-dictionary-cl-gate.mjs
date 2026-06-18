#!/usr/bin/env node
/** MF-LX-03 — diccionario farmacologico CL demo (>=50, sin IA). */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const pkgDir = join(root, 'packages/drug-dictionary-cl');
if (!existsSync(join(pkgDir, 'src/index.ts'))) {
  errors.push('Falta packages/drug-dictionary-cl');
}

const seedSrc = readFileSync(join(pkgDir, 'src/drugSeedEsCl.ts'), 'utf8');
const idCount = (seedSrc.match(/id: '/g) ?? []).length;
if (idCount < 50) {
  errors.push(`drugSeedEsCl tiene ${idCount} entradas (min 50)`);
}

const indexSrc = readFileSync(join(pkgDir, 'src/index.ts'), 'utf8');
for (const token of ['DRUG_DICTIONARY_CL', 'searchDrugsEsCl', 'assertDrugDictionaryClInvariants']) {
  if (!indexSrc.includes(token)) {
    errors.push(`drug-dictionary-cl/index.ts falta ${token}`);
  }
}

const vitest = spawnSync(
  'npx',
  ['vitest', 'run', 'packages/drug-dictionary-cl/src/drug-dictionary.test.ts'],
  { cwd: root, encoding: 'utf8', shell: true },
);
if (vitest.status !== 0) {
  errors.push('drug-dictionary-cl tests fallaron');
  if (vitest.stdout) process.stdout.write(vitest.stdout);
  if (vitest.stderr) process.stderr.write(vitest.stderr);
}

if (errors.length) {
  console.error(
    'drug-dictionary-cl-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log(`drug-dictionary-cl-gate OK — ${idCount} farmacos demo MF-LX-03`);
