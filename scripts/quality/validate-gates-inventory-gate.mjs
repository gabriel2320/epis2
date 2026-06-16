#!/usr/bin/env node
/** MF-CON-03 — inventario gates presente y reciente. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const inventoryScript = join(root, 'tools/gates/inventory-orphans.mjs');
const report = join(root, 'reports/gates-inventory-2026-06.md');

if (!existsSync(inventoryScript)) {
  errors.push('falta tools/gates/inventory-orphans.mjs');
}
if (!existsSync(report)) {
  errors.push('falta reports/gates-inventory-2026-06.md — ejecutar node tools/gates/inventory-orphans.mjs');
} else {
  const text = readFileSync(report, 'utf8');
  for (const token of ['Catálogo-only', 'Gates wired', 'catalog-only']) {
    if (!text.includes(token)) errors.push(`inventario sin sección ${token}`);
  }
}

if (errors.length) {
  console.error('gates-inventory-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('gates-inventory-gate OK — inventario gates read-only presente');
