#!/usr/bin/env node
/** MF-TRAMO-H-001 — Inventario IAAS avanzada (IDC 141–150). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'docs/product/EPIS2_TRAMO_H_IAAS_INVENTORY.md',
  'docs/product/EPIS2_TRAMO_H_PLAN.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta ${rel}`);
}

const doc = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_H_IAAS_INVENTORY.md'), 'utf8');
for (const id of [141, 144, 148, 150]) {
  if (!doc.includes(`| ${id} |`)) errors.push(`inventario H sin IDC ${id}`);
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_H_PLAN.md'), 'utf8');
if (!plan.includes('MF-TRAMO-H-001')) errors.push('plan sin MF-TRAMO-H-001');

if (errors.length) {
  console.error('tramo-h-inventory-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-h-inventory-gate OK — inventario y plan IAAS Tramo H');
