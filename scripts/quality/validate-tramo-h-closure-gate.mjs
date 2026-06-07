#!/usr/bin/env node
/** MF-TRAMO-H-CLOSURE — Cierre técnico Tramo H IAAS avanzada. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const doc = join(root, 'docs/product/EPIS2_TRAMO_H_CLOSURE.md');
if (!existsSync(doc)) errors.push('falta EPIS2_TRAMO_H_CLOSURE.md');

const gates = [
  'validate-tramo-h-inventory-gate.mjs',
  'validate-tramo-h-iaas-gate.mjs',
  'validate-tramo-h-scaffold-gate.mjs',
  'validate-tramo-h-audit-gate.mjs',
];

for (const gate of gates) {
  if (!existsSync(join(root, 'scripts/quality', gate))) {
    errors.push(`falta gate ${gate}`);
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_H_PLAN.md'), 'utf8');
for (const mf of [
  'MF-TRAMO-H-002',
  'MF-TRAMO-H-005',
  'MF-TRAMO-H-008',
  'MF-TRAMO-H-011',
  'MF-TRAMO-H-CLOSURE',
]) {
  if (!plan.includes(mf)) errors.push(`plan sin ${mf}`);
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
for (const id of [141, 142, 143, 144, 145, 146, 147, 148, 149, 150]) {
  if (!matrix.includes(`${id}: { estado: 'Active'`)) {
    errors.push(`IDC ${id} no Active — Tramo H incompleto`);
  }
}

const e2e = join(root, 'e2e/tramo-h-iaas.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-h-iaas.spec.ts');

if (errors.length) {
  console.error('tramo-h-closure-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-h-closure-gate OK — Tramo H IAAS avanzada cerrado técnicamente');
