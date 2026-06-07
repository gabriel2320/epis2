#!/usr/bin/env node
/** MF-TRAMO-E-CLOSURE — Cierre técnico Tramo E scaffold pabellón. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const doc = join(root, 'docs/product/EPIS2_TRAMO_E_CLOSURE.md');
if (!existsSync(doc)) errors.push('falta EPIS2_TRAMO_E_CLOSURE.md');

const gates = [
  'validate-tramo-e-inventory-gate.mjs',
  'validate-tramo-e-or-gate.mjs',
  'validate-tramo-e-who-checklist-gate.mjs',
  'validate-tramo-e-preanesthesia-gate.mjs',
  'validate-tramo-e-scaffold-gate.mjs',
  'validate-tramo-e-audit-gate.mjs',
];

for (const gate of gates) {
  if (!existsSync(join(root, 'scripts/quality', gate))) {
    errors.push(`falta gate ${gate}`);
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_E_PLAN.md'), 'utf8');
for (const mf of [
  'MF-TRAMO-E-002',
  'MF-TRAMO-E-003',
  'MF-TRAMO-E-004',
  'MF-TRAMO-E-005',
  'MF-TRAMO-E-011',
  'MF-TRAMO-E-CLOSURE',
]) {
  if (!plan.includes(mf)) errors.push(`plan sin ${mf}`);
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
for (const id of [151, 152, 153, 154, 155, 156, 157, 158, 159, 160]) {
  if (!matrix.includes(`${id}: { estado: 'Active'`)) {
    errors.push(`IDC ${id} no Active — Tramo E incompleto`);
  }
}

if (errors.length) {
  console.error('tramo-e-closure-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-e-closure-gate OK — Tramo E scaffold pabellón cerrado técnicamente');
