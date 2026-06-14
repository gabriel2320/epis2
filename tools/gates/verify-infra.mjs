#!/usr/bin/env node
/** Verifica artefactos PROG-CONSOLIDATE Fase 0–1. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'tools/legacy-scripts/package-before-consolidation.json',
  'tools/gates/run-gate.mjs',
  'tools/gates/required.json',
  'tools/gates/nightly.json',
  'tools/gates/experimental.json',
  'tools/gates/catalog.json',
  'tools/scripts/classify.mjs',
  'docs/MAINTENANCE_PACKAGE_SCRIPTS.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
for (const script of ['quality:required', 'quality:nightly', 'tool:gates:sync-catalog', 'tool:scripts:classify']) {
  if (!pkg.scripts?.[script]) errors.push(`package.json sin ${script}`);
}

if (errors.length) {
  console.error('consolidation-infra FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('consolidation-infra OK — Fase 0–1 gates');
