#!/usr/bin/env node
/** MF-TRAMO-J-CLOSURE — Cierre técnico Tramo J farmacia clínica. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const doc = join(root, 'docs/product/EPIS2_TRAMO_J_CLOSURE.md');
if (!existsSync(doc)) errors.push('falta EPIS2_TRAMO_J_CLOSURE.md');

const gates = [
  'validate-tramo-j-inventory-gate.mjs',
  'validate-tramo-j-pharmacy-gate.mjs',
  'validate-tramo-j-scaffold-gate.mjs',
  'validate-tramo-j-audit-gate.mjs',
];

for (const gate of gates) {
  if (!existsSync(join(root, 'scripts/quality', gate))) {
    errors.push(`falta gate ${gate}`);
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_J_PLAN.md'), 'utf8');
for (const mf of [
  'MF-TRAMO-J-002',
  'MF-TRAMO-J-005',
  'MF-TRAMO-J-008',
  'MF-TRAMO-J-011',
  'MF-TRAMO-J-CLOSURE',
]) {
  if (!plan.includes(mf)) errors.push(`plan sin ${mf}`);
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
for (const id of [161, 162, 163, 164, 166, 167, 168, 169, 170]) {
  if (!matrix.includes(`${id}: { estado: 'Active'`)) {
    errors.push(`IDC ${id} no Active — Tramo J incompleto`);
  }
}
if (!matrix.includes("165: { estado: 'Done'")) {
  errors.push('IDC 165 no Done — conciliación core');
}
if (!matrix.includes('MF-TRAMO-J-006')) {
  errors.push('matriz sin MF-TRAMO-J-006 conciliación panel');
}

const e2e = join(root, 'e2e/tramo-j-pharmacy.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-j-pharmacy.spec.ts');

if (errors.length) {
  console.error('tramo-j-closure-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-j-closure-gate OK — Tramo J farmacia clínica cerrado técnicamente');
