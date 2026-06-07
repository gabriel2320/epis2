#!/usr/bin/env node
/** MF-TRAMO-F-CLOSURE — Cierre técnico Tramo F scaffold APS. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const doc = join(root, 'docs/product/EPIS2_TRAMO_F_CLOSURE.md');
if (!existsSync(doc)) errors.push('falta EPIS2_TRAMO_F_CLOSURE.md');

const gates = [
  'validate-tramo-f-inventory-gate.mjs',
  'validate-tramo-f-aps-gate.mjs',
  'validate-tramo-f-scaffold-gate.mjs',
  'validate-tramo-f-audit-gate.mjs',
];

for (const gate of gates) {
  if (!existsSync(join(root, 'scripts/quality', gate))) {
    errors.push(`falta gate ${gate}`);
  }
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_F_PLAN.md'), 'utf8');
for (const mf of [
  'MF-TRAMO-F-002',
  'MF-TRAMO-F-005',
  'MF-TRAMO-F-008',
  'MF-TRAMO-F-011',
  'MF-TRAMO-F-CLOSURE',
]) {
  if (!plan.includes(mf)) errors.push(`plan sin ${mf}`);
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
for (const id of [121, 122, 123, 124, 125, 126, 127, 128, 129, 130]) {
  if (!matrix.includes(`${id}: { estado: 'Active'`)) {
    errors.push(`IDC ${id} no Active — Tramo F incompleto`);
  }
}

const e2e = join(root, 'e2e/tramo-f-aps.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-f-aps.spec.ts');

if (errors.length) {
  console.error('tramo-f-closure-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-f-closure-gate OK — Tramo F scaffold APS cerrado técnicamente');
