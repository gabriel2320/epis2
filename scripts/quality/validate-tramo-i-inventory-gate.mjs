#!/usr/bin/env node
/** MF-TRAMO-I-001 — Inventario especialidades gráficas (IDC 181–190). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'docs/product/EPIS2_TRAMO_I_SPECIALTY_INVENTORY.md',
  'docs/product/EPIS2_TRAMO_I_PLAN.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta ${rel}`);
}

const doc = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_I_SPECIALTY_INVENTORY.md'), 'utf8');
for (const id of [181, 183, 187, 190]) {
  if (!doc.includes(`| ${id} |`)) errors.push(`inventario I sin IDC ${id}`);
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_I_PLAN.md'), 'utf8');
if (!plan.includes('MF-TRAMO-I-001')) errors.push('plan sin MF-TRAMO-I-001');

if (errors.length) {
  console.error('tramo-i-inventory-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-i-inventory-gate OK — inventario y plan especialidades Tramo I');
