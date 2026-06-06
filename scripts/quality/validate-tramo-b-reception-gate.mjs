#!/usr/bin/env node
/** MF-TRAMO-B-001 — Inventario recepción IDC 2–20 Defer/Exclude. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const docPath = join(root, 'docs/product/EPIS2_TRAMO_B_RECEPTION_INVENTORY.md');
if (!existsSync(docPath)) {
  errors.push('falta EPIS2_TRAMO_B_RECEPTION_INVENTORY.md');
} else {
  const doc = readFileSync(docPath, 'utf8');
  if (!doc.includes('MF-TRAMO-B-001')) errors.push('doc recepción sin MF-TRAMO-B-001');
  for (const id of [2, 11, 20]) {
    if (!doc.includes(`| ${id} |`)) errors.push(`doc recepción sin fila IDC ${id}`);
  }
}

const matrix = JSON.parse(
  readFileSync(join(root, 'docs/product/epis2-idc-execution-matrix.json'), 'utf8'),
);
const byId = Object.fromEntries(matrix.items.map((r) => [r.idc, r]));

for (let id = 11; id <= 20; id++) {
  const row = byId[id];
  if (!row) {
    errors.push(`matriz sin IDC ${id}`);
    continue;
  }
  if (id === 14) {
    if (row.decision !== 'Integrate') {
      errors.push(`IDC 14 debe ser Integrate (aseguradoras), tiene ${row.decision}`);
    }
  } else if (row.decision !== 'Defer') {
    errors.push(`IDC ${id} debe ser Defer (facturación Tramo B), tiene ${row.decision}`);
  }
}

for (let id = 2; id <= 10; id++) {
  const row = byId[id];
  if (row?.workspace !== 'reception') {
    errors.push(`IDC ${id} workspace debe ser reception`);
  }
}

if (errors.length) {
  console.error('tramo-b-reception-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-b-reception-gate OK — IDC 2–20 inventariados');
