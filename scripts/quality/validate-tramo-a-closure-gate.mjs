#!/usr/bin/env node
/** MF-TRAMO-A-CLOSURE — Cierre Tramo A producto clínico demostrable. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const doc = join(root, 'docs/product/EPIS2_TRAMO_A_CLOSURE.md');
if (!existsSync(doc)) errors.push('falta EPIS2_TRAMO_A_CLOSURE.md');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes("38: { estado: 'Planned'") || !matrix.includes('MF-TRAMO-A-CLOSURE')) {
  errors.push('IDC 38 no deferido en matriz');
}

for (const id of [21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 39, 40]) {
  if (!matrix.includes(`${id}: { estado: 'Done'`)) {
    errors.push(`IDC ${id} no Done — Tramo A incompleto`);
  }
}

const olaGates = [
  'validate-ola2-m3-ui-gate.mjs',
  'validate-ola2-physical-exam-gate.mjs',
  'validate-ola3-ficha-hub-gate.mjs',
  'validate-ola3-ficha-depth-gate.mjs',
  'validate-ola3-longitudinal-gate.mjs',
  'validate-ola3-surgical-gate.mjs',
  'validate-ola6a-print-gate.mjs',
];

for (const gate of olaGates) {
  if (!existsSync(join(root, 'scripts/quality', gate))) {
    errors.push(`falta gate ${gate}`);
  }
}

if (errors.length) {
  console.error('tramo-a-closure-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-a-closure-gate OK — Tramo A clínico demostrable cerrado');
