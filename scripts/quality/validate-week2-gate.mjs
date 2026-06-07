#!/usr/bin/env node
/** MF-DEV-WEEK2-CLOSURE — Bucle tramo acelerado Semana 2. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const report = join(root, 'reports/epis2-dev-automation-week2-2026-06-07.md');
if (!existsSync(report)) errors.push('falta reporte week2');

for (const gate of [
  'validate-tramo-scaffold-canon-gate.mjs',
  'validate-tramo-e2e-registry-gate.mjs',
]) {
  if (!existsSync(join(root, 'scripts/quality', gate))) {
    errors.push(`falta ${gate}`);
  }
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
for (const npm of [
  'quality:tramo-scaffold-canon-gate',
  'quality:tramo-e2e-registry-gate',
  'quality:week2-gate',
  'test:e2e:tramo-j',
]) {
  if (!pkg.includes(`"${npm}"`)) errors.push(`package.json sin ${npm}`);
}

if (errors.length) {
  console.error('week2-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('week2-gate OK — Semana 2 bucle tramo acelerado cerrado');
