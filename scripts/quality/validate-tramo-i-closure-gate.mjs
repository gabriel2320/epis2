#!/usr/bin/env node
/** MF-TRAMO-I-CLOSURE — Cierre técnico Tramo I especialidades gráficas. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const doc = join(root, 'docs/product/EPIS2_TRAMO_I_CLOSURE.md');
if (!existsSync(doc)) errors.push('falta EPIS2_TRAMO_I_CLOSURE.md');

const gates = [
  'validate-tramo-i-inventory-gate.mjs',
  'validate-tramo-i-specialty-gate.mjs',
  'validate-tramo-i-scaffold-gate.mjs',
  'validate-tramo-i-audit-gate.mjs',
];

for (const gate of gates) {
  if (!existsSync(join(root, 'scripts/quality', gate))) {
    errors.push(`falta gate ${gate}`);
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_I_PLAN.md'), 'utf8');
for (const mf of [
  'MF-TRAMO-I-002',
  'MF-TRAMO-I-005',
  'MF-TRAMO-I-008',
  'MF-TRAMO-I-011',
  'MF-TRAMO-I-CLOSURE',
]) {
  if (!plan.includes(mf)) errors.push(`plan sin ${mf}`);
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
for (const id of [181, 182, 183, 184, 185, 186, 187, 188, 189, 190]) {
  if (!matrix.includes(`${id}: { estado: 'Active'`)) {
    errors.push(`IDC ${id} no Active — Tramo I incompleto`);
  }
}

const e2e = join(root, 'e2e/tramo-i-specialty.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-i-specialty.spec.ts');

if (errors.length) {
  console.error('tramo-i-closure-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-i-closure-gate OK — Tramo I especialidades gráficas cerrado técnicamente');
