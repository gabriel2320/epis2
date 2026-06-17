#!/usr/bin/env node
/** MF-DEV-WEEK3-CLOSURE — IA producto en el loop. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const report = join(root, 'reports/archive/2026-06/epis2-dev-automation-week3-2026-06-07.md');
if (!existsSync(report)) errors.push('falta reporte week3');

for (const gate of ['validate-ai-tramo-evals-gate.mjs', 'validate-ai-catalog-smoke-gate.mjs']) {
  if (!existsSync(join(root, 'scripts/quality', gate))) errors.push(`falta ${gate}`);
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
for (const npm of [
  'quality:ai-tramo-evals-gate',
  'quality:ai-catalog-smoke-gate',
  'quality:week3-gate',
  'ai:evals:tramo-j',
  'ai:catalog-assist-smoke',
]) {
  if (!pkg.includes(`"${npm}"`)) errors.push(`package.json sin ${npm}`);
}

if (errors.length) {
  console.error('week3-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('week3-gate OK — Semana 3 IA producto en el loop cerrada');
