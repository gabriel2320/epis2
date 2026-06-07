#!/usr/bin/env node
/** MF-TRAMO-D-CLOSURE — Cierre técnico Tramo D scaffold UCI. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const doc = join(root, 'docs/product/EPIS2_TRAMO_D_CLOSURE.md');
if (!existsSync(doc)) errors.push('falta EPIS2_TRAMO_D_CLOSURE.md');

const gates = [
  'validate-tramo-d-inventory-gate.mjs',
  'validate-tramo-d-icu-gate.mjs',
  'validate-tramo-d-flowsheet-gate.mjs',
  'validate-tramo-d-hemodynamics-gate.mjs',
  'validate-tramo-d-fluid-balance-gate.mjs',
  'validate-tramo-d-ventilation-gate.mjs',
  'validate-tramo-d-invasive-gate.mjs',
  'validate-tramo-d-icu-discharge-gate.mjs',
  'validate-tramo-d-neurological-gate.mjs',
  'validate-tramo-d-severity-scales-gate.mjs',
  'validate-tramo-d-vasoactive-gate.mjs',
  'validate-tramo-d-sedoanalgesia-gate.mjs',
];

for (const gate of gates) {
  if (!existsSync(join(root, 'scripts/quality', gate))) {
    errors.push(`falta gate ${gate}`);
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_D_PLAN.md'), 'utf8');
for (const mf of [
  'MF-TRAMO-D-002',
  'MF-TRAMO-D-005',
  'MF-TRAMO-D-006',
  'MF-TRAMO-D-007',
  'MF-TRAMO-D-008',
  'MF-TRAMO-D-009',
  'MF-TRAMO-D-010',
  'MF-TRAMO-D-011',
  'MF-TRAMO-D-012',
  'MF-TRAMO-D-CLOSURE',
]) {
  if (!plan.includes(mf)) errors.push(`plan sin ${mf}`);
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
for (const id of [41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 135]) {
  if (!matrix.includes(`${id}: { estado: 'Active'`)) {
    errors.push(`IDC ${id} no Active — Tramo D incompleto`);
  }
}

if (errors.length) {
  console.error('tramo-d-closure-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-d-closure-gate OK — Tramo D scaffold UCI cerrado técnicamente');
