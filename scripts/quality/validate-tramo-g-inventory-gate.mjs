#!/usr/bin/env node
/** MF-TRAMO-G-001 — Inventario UCI especializada (IDC 131–140). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'docs/product/EPIS2_TRAMO_G_UCI_SPECIALIZED_INVENTORY.md',
  'docs/product/EPIS2_TRAMO_G_PLAN.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta ${rel}`);
}

const doc = readFileSync(
  join(root, 'docs/product/EPIS2_TRAMO_G_UCI_SPECIALIZED_INVENTORY.md'),
  'utf8',
);
for (const id of [131, 135, 139, 140]) {
  if (!doc.includes(`| ${id} |`)) errors.push(`inventario G sin IDC ${id}`);
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_G_PLAN.md'), 'utf8');
if (!plan.includes('MF-TRAMO-G-001')) errors.push('plan sin MF-TRAMO-G-001');

if (errors.length) {
  console.error('tramo-g-inventory-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-g-inventory-gate OK — inventario y plan UCI especializada Tramo G');
