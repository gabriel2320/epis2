#!/usr/bin/env node
/** MF-TRAMO-G-CLOSURE — Cierre técnico Tramo G UCI especializada. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const doc = join(root, 'docs/product/EPIS2_TRAMO_G_CLOSURE.md');
if (!existsSync(doc)) errors.push('falta EPIS2_TRAMO_G_CLOSURE.md');

const gates = [
  'validate-tramo-g-inventory-gate.mjs',
  'validate-tramo-g-specialized-gate.mjs',
  'validate-tramo-g-scaffold-gate.mjs',
  'validate-tramo-g-audit-gate.mjs',
];

for (const gate of gates) {
  if (!existsSync(join(root, 'scripts/quality', gate))) {
    errors.push(`falta gate ${gate}`);
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_G_PLAN.md'), 'utf8');
for (const mf of [
  'MF-TRAMO-G-002',
  'MF-TRAMO-G-005',
  'MF-TRAMO-G-008',
  'MF-TRAMO-G-010',
  'MF-TRAMO-G-CLOSURE',
]) {
  if (!plan.includes(mf)) errors.push(`plan sin ${mf}`);
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
for (const id of [131, 132, 133, 134, 135, 136, 137, 138, 139, 140]) {
  if (!matrix.includes(`${id}: { estado: 'Active'`)) {
    errors.push(`IDC ${id} no Active — Tramo G incompleto`);
  }
}

const e2e = join(root, 'e2e/tramo-g-icu.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-g-icu.spec.ts');

if (errors.length) {
  console.error('tramo-g-closure-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-g-closure-gate OK — Tramo G UCI especializada cerrado técnicamente');
