#!/usr/bin/env node
/** MF-TRAMO-E-001 — Inventario pabellón (IDC 151–160). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'docs/product/EPIS2_TRAMO_E_OR_INVENTORY.md',
  'docs/product/EPIS2_TRAMO_E_PLAN.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta ${rel}`);
}

const doc = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_E_OR_INVENTORY.md'), 'utf8');
for (const id of [151, 152, 156, 160]) {
  if (!doc.includes(`| ${id} |`)) errors.push(`inventario OR sin IDC ${id}`);
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_E_PLAN.md'), 'utf8');
if (!plan.includes('Tramo E')) errors.push('plan Tramo E incompleto');
if (!plan.includes('MF-TRAMO-E-001')) errors.push('plan sin MF-TRAMO-E-001');

if (errors.length) {
  console.error('tramo-e-inventory-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-e-inventory-gate OK — inventario y plan pabellón Tramo E');
