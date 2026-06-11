#!/usr/bin/env node
/** MF-NORM-00 — benchmark board + plan canon. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'docs/design/EPIS2_FICHA_NORMALIZACION_PLAN.md',
  'docs/design/references/benchmark-board.md',
  'reports/epis2-mf-norm-00-benchmark.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta: ${rel}`);
}

const board = readFileSync(join(root, 'docs/design/references/benchmark-board.md'), 'utf8');
const urlCount = (board.match(/https:\/\//g) ?? []).length;
if (urlCount < 6) errors.push(`benchmark-board necesita ≥6 URLs (tiene ${urlCount})`);

for (const needle of ['Material 3 Expressive', 'm3.material.io', 'Figma M3', 'Anti-referencias']) {
  if (!board.includes(needle)) errors.push(`benchmark-board falta sección: ${needle}`);
}

if (errors.length) {
  console.error('ficha-norm-benchmark-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ficha-norm-benchmark-gate OK — MF-NORM-00');
