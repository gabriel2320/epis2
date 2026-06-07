#!/usr/bin/env node
/** MF-TRAMO-J-001 — Inventario farmacia clínica (IDC 161–170). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'docs/product/EPIS2_TRAMO_J_PHARMACY_INVENTORY.md',
  'docs/product/EPIS2_TRAMO_J_PLAN.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta ${rel}`);
}

const doc = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_J_PHARMACY_INVENTORY.md'), 'utf8');
for (const id of [161, 163, 165, 170]) {
  if (!doc.includes(`| ${id} |`)) errors.push(`inventario J sin IDC ${id}`);
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_J_PLAN.md'), 'utf8');
if (!plan.includes('MF-TRAMO-J-001')) errors.push('plan sin MF-TRAMO-J-001');

if (errors.length) {
  console.error('tramo-j-inventory-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-j-inventory-gate OK — inventario y plan farmacia Tramo J');
