#!/usr/bin/env node
/** MF-DI-03 — autocomplete con ranking de frecuencia. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'packages/clinical-domain/src/catalogFrequencyRank.ts',
  'packages/clinical-domain/src/catalogFrequencyRank.test.ts',
  'apps/api/src/catalog/medicationRank.ts',
  'apps/web/src/clinical/MedicationCatalogAutocomplete.tsx',
  'apps/web/src/clinical/useCommandDictionarySuggestions.ts',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const medAutocomplete = readFileSync(
  join(root, 'apps/web/src/clinical/MedicationCatalogAutocomplete.tsx'),
  'utf8',
);
if (!medAutocomplete.includes('bumpCatalogUsage')) {
  errors.push('MedicationCatalogAutocomplete debe registrar uso personal');
}

const dictionary = readFileSync(
  join(root, 'packages/command-registry/src/clinical-command-dictionary.ts'),
  'utf8',
);
if (!dictionary.includes('rankAutocompletePhrases')) {
  errors.push('command dictionary debe rankear frases lab/dx');
}

for (const suite of [
  'packages/clinical-domain/src/catalogFrequencyRank.test.ts',
  'packages/command-registry/src/clinical-command-dictionary.test.ts',
  'apps/web/src/clinical/MedicationCatalogAutocomplete.test.tsx',
]) {
  const run = spawnSync('npx', ['vitest', 'run', '--run', suite], {
    cwd: root,
    shell: true,
    encoding: 'utf8',
  });
  if (run.status !== 0) errors.push(`${suite} falló`);
}

if (errors.length) {
  console.error('quality:di-autocomplete-gate — FALLO');
  for (const e of errors) console.error(`  · ${e}`);
  process.exit(1);
}

console.log('quality:di-autocomplete-gate — OK (MF-DI-03)');
