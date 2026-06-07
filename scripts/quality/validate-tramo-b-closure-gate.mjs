#!/usr/bin/env node
/** MF-TRAMO-B-CLOSURE — Cierre técnico Tramo B recepción ambulatoria. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const doc = join(root, 'docs/product/EPIS2_TRAMO_B_CLOSURE.md');
if (!existsSync(doc)) errors.push('falta EPIS2_TRAMO_B_CLOSURE.md');

const inventory = join(root, 'docs/product/EPIS2_TRAMO_B_RECEPTION_INVENTORY.md');
if (!existsSync(inventory)) errors.push('falta EPIS2_TRAMO_B_RECEPTION_INVENTORY.md');

for (const gate of [
  'validate-tramo-b-reception-gate.mjs',
  'validate-tramo-b-ui-gate.mjs',
]) {
  if (!existsSync(join(root, 'scripts/quality', gate))) {
    errors.push(`falta gate ${gate}`);
  }
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
for (const id of [2, 3, 4, 5, 7, 8, 9]) {
  if (!matrix.includes(`${id}: { estado: 'Done'`)) {
    errors.push(`IDC ${id} no Done — Tramo B incompleto`);
  }
}
for (const id of [6, 10]) {
  if (!matrix.includes(`${id}: { estado: 'Active'`)) {
    errors.push(`IDC ${id} no Active — Tramo B incompleto`);
  }
}

const closure = readFileSync(doc, 'utf8');
if (!closure.includes('MF-TRAMO-B-CLOSURE')) {
  errors.push('closure sin MF-TRAMO-B-CLOSURE');
}
if (closure.toLowerCase().includes('home = dashboard') || closure.includes('home = `/dashboard`')) {
  errors.push('closure Tramo B contradice home canónico');
}

if (errors.length) {
  console.error('tramo-b-closure-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-b-closure-gate OK — Tramo B recepción cerrado técnicamente');
