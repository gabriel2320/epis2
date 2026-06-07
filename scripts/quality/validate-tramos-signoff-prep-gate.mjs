#!/usr/bin/env node
/** Preparación signoff clínico A–K post-cierre técnico. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const report = join(root, 'reports/epis2-tramos-ak-signoff-prep-2026-06-07.md');
if (!existsSync(report)) errors.push('falta reporte signoff prep');

for (const gate of [
  'validate-tramos-ak-closure-gate.mjs',
  'validate-tramos-clinical-signoff-gate.mjs',
  'validate-tramos-hygiene-gate.mjs',
]) {
  if (!existsSync(join(root, 'scripts/quality', gate))) errors.push(`falta ${gate}`);
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
for (const npm of [
  'quality:tramos-ak-closure-gate',
  'quality:tramos-signoff-prep-gate',
  'quality:tramos-run-ak-closure-gates',
]) {
  if (!pkg.includes(`"${npm}"`)) errors.push(`package.json sin ${npm}`);
}

if (errors.length) {
  console.error('tramos-signoff-prep-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramos-signoff-prep-gate OK — preparación signoff A–K documentada');
