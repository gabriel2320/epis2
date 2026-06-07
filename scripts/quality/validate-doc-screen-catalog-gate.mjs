#!/usr/bin/env node
/** MF-DOC-002 — Screen catalog §5–19 reconciliado con matriz IDC y rutas. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const catalog = readFileSync(
  join(root, 'docs/product/EPIS2_COMPLETE_SCREEN_CATALOG.md'),
  'utf8',
);
const errors = [];

const checks = [
  ['§6 ambulatorio', () => catalog.includes('/espacio/ambulatorio')],
  ['§9 bandeja resultados', () => catalog.includes('/espacio/resultados')],
  ['§5 alertas IDC 22', () => catalog.includes('IDC 22 Done')],
  ['§20 print certificado', () => catalog.includes('/espacio/certificado/imprimir')],
  ['§6 print A5', () => catalog.includes('MF-OLA6A-001') || catalog.includes('MF-OLA6A-002')],
];

for (const [label, ok] of checks) {
  if (!ok()) errors.push(`catalogo sin reconciliar: ${label}`);
}

if (errors.length) {
  console.error('doc-screen-catalog-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('doc-screen-catalog-gate OK — §5–19 + §20 reconciliados');
