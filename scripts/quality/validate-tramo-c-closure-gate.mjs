#!/usr/bin/env node
/** MF-TRAMO-C-CLOSURE — Cierre técnico Tramo C hospitalización + urgencias. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const doc = join(root, 'docs/product/EPIS2_TRAMO_C_CLOSURE.md');
if (!existsSync(doc)) errors.push('falta EPIS2_TRAMO_C_CLOSURE.md');

const gates = [
  'validate-tramo-c-emergency-gate.mjs',
  'validate-tramo-c-admission-gate.mjs',
  'validate-tramo-c-orders-gate.mjs',
  'validate-tramo-c-trends-gate.mjs',
  'validate-tramo-c-epicrisis-gate.mjs',
  'validate-tramo-c-census-gate.mjs',
  'validate-tramo-c-mar-gate.mjs',
];

for (const gate of gates) {
  if (!existsSync(join(root, 'scripts/quality', gate))) {
    errors.push(`falta gate ${gate}`);
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_C_PLAN.md'), 'utf8');
for (const mf of ['MF-TRAMO-C-005', 'MF-TRAMO-C-006', 'MF-TRAMO-C-007', 'MF-TRAMO-C-008']) {
  if (!plan.includes(mf)) errors.push(`plan sin ${mf}`);
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes("116: { estado: 'Done'")) {
  errors.push('IDC 116 no promovido a Done');
}

if (errors.length) {
  console.error('tramo-c-closure-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-c-closure-gate OK — Tramo C hospitalización + urgencias cerrado técnicamente');
