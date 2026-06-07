#!/usr/bin/env node
/** MF-TRAMO-K-CLOSURE — Cierre técnico Tramo K calidad/auditoría. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const doc = join(root, 'docs/product/EPIS2_TRAMO_K_CLOSURE.md');
if (!existsSync(doc)) errors.push('falta EPIS2_TRAMO_K_CLOSURE.md');

const gates = [
  'validate-tramo-k-inventory-gate.mjs',
  'validate-tramo-k-quality-gate.mjs',
  'validate-tramo-k-scaffold-gate.mjs',
  'validate-tramo-k-audit-gate.mjs',
];

for (const gate of gates) {
  if (!existsSync(join(root, 'scripts/quality', gate))) {
    errors.push(`falta gate ${gate}`);
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_K_PLAN.md'), 'utf8');
for (const mf of [
  'MF-TRAMO-K-002',
  'MF-TRAMO-K-005',
  'MF-TRAMO-K-008',
  'MF-TRAMO-K-011',
  'MF-TRAMO-K-CLOSURE',
]) {
  if (!plan.includes(mf)) errors.push(`plan sin ${mf}`);
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
for (const id of [171, 172, 173, 174, 175, 176, 177, 178, 179, 180]) {
  if (!matrix.includes(`${id}: { estado: 'Active'`)) {
    errors.push(`IDC ${id} no Active — Tramo K incompleto`);
  }
}
if (!matrix.includes('MF-TRAMO-K-011')) {
  errors.push('matriz sin MF-TRAMO-K-011 suspensión Qx panel');
}

const e2e = join(root, 'e2e/tramo-k-quality.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-k-quality.spec.ts');

if (errors.length) {
  console.error('tramo-k-closure-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-k-closure-gate OK — Tramo K calidad/auditoría cerrado técnicamente');
