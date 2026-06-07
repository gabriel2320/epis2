#!/usr/bin/env node
/** MF-TRAMO-D-001 — Inventario UCI programas especializados (IDC 41–50, 131–140). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'docs/product/EPIS2_TRAMO_D_UCI_INVENTORY.md',
  'docs/product/EPIS2_TRAMO_D_PLAN.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta ${rel}`);
}

const doc = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_D_UCI_INVENTORY.md'), 'utf8');
for (const id of [41, 50, 131, 140]) {
  if (!doc.includes(`| ${id} |`)) errors.push(`inventario UCI sin IDC ${id}`);
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_D_PLAN.md'), 'utf8');
if (!plan.includes('Tramo D')) errors.push('plan Tramo D incompleto');

if (errors.length) {
  console.error('tramo-d-inventory-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-d-inventory-gate OK — inventario y plan UCI Tramo D');
