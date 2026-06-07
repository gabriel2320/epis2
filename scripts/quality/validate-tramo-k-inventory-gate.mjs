#!/usr/bin/env node
/** MF-TRAMO-K-001 — Inventario calidad/auditoría (IDC 171–180). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'docs/product/EPIS2_TRAMO_K_QUALITY_INVENTORY.md',
  'docs/product/EPIS2_TRAMO_K_PLAN.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta ${rel}`);
}

const doc = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_K_QUALITY_INVENTORY.md'), 'utf8');
for (const id of [171, 172, 178, 180]) {
  if (!doc.includes(`| ${id} |`)) errors.push(`inventario K sin IDC ${id}`);
}

const plan = readFileSync(join(root, 'docs/product/EPIS2_TRAMO_K_PLAN.md'), 'utf8');
if (!plan.includes('MF-TRAMO-K-001')) errors.push('plan sin MF-TRAMO-K-001');
if (!plan.includes('?tab=quality')) errors.push('plan sin tab quality');

const blueprints = readFileSync(join(root, 'scripts/ai-tramo-blueprints.mjs'), 'utf8');
if (!blueprints.includes("K: ['")) errors.push('ai-tramo-blueprints sin tramo K');

if (errors.length) {
  console.error('tramo-k-inventory-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-k-inventory-gate OK — inventario y plan calidad Tramo K');
