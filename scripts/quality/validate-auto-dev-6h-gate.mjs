#!/usr/bin/env node
/** PROG-AUTO-DEV-6H — gate documentación + runner + diccionario. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'docs/product/EPIS2_AUTO_DEV_6H_PROGRAM.md',
  'docs/product/EPIS2_PM03_AUTO_ORCHESTRATION.md',
  'docs/product/EPIS2_CLINICAL_TERMINOLOGY.md',
  'docs/quality/auto-dev-6h-ledger.json',
  'scripts/dev-agent/auto-dev-6h-runner.mjs',
  'scripts/dev-agent/auto-dev-orchestrator.mjs',
  'scripts/dev-agent/auto-dev-preconditions.mjs',
  'packages/command-registry/src/clinical-command-dictionary.ts',
  'apps/web/src/clinical/useCommandDictionarySuggestions.ts',
]) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const dict = readFileSync(
  join(root, 'packages/command-registry/src/clinical-command-dictionary.ts'),
  'utf8',
);
for (const token of [
  'filterClinicalCommandAutocomplete',
  'getClinicalCommandMenuGroups',
  'register_problem',
  'diagnostico',
]) {
  if (!dict.includes(token)) errors.push(`clinical-command-dictionary.ts sin ${token}`);
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
if (!pkg.includes('dev:auto:6h')) errors.push('package.json sin script dev:auto:6h');

if (errors.length) {
  console.error('auto-dev-6h-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('auto-dev-6h-gate OK — PROG-AUTO-DEV-6H');
