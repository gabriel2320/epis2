#!/usr/bin/env node
/** MF-TRAMO-F-001 — Inventario APS (IDC 121–130). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'docs/product/EPIS2_TRAMO_F_APS_INVENTORY.md',
  'docs/product/EPIS2_TRAMO_F_PLAN.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta ${rel}`);
}

const doc = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_F_APS_INVENTORY.md'), 'utf8');
for (const id of [121, 125, 128, 130]) {
  if (!doc.includes(`| ${id} |`)) errors.push(`inventario APS sin IDC ${id}`);
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_F_PLAN.md'), 'utf8');
if (!plan.includes('MF-TRAMO-F-001')) errors.push('plan sin MF-TRAMO-F-001');

if (errors.length) {
  console.error('tramo-f-inventory-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-f-inventory-gate OK — inventario y plan APS Tramo F');
