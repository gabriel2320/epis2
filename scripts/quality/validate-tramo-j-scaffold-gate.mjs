#!/usr/bin/env node
/** MF-TRAMO-J-003 … J-011 — Paneles farmacia demo (IDC 162–170). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/PharmacyDashboardTab.tsx'), 'utf8');
const api = readFileSync(join(root, 'apps/api/src/dashboard/pharmacy.ts'), 'utf8');
const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');

const panels = [
  ['epis2-pharmacy-renal-dose', '162', 'MF-TRAMO-J-003'],
  ['epis2-pharmacy-tdm', '163', 'MF-TRAMO-J-004'],
  ['epis2-pharmacy-ram', '164', 'MF-TRAMO-J-005'],
  ['epis2-pharmacy-reconciliation', '165', 'MF-TRAMO-J-006'],
  ['epis2-pharmacy-dispensing', '166', 'MF-TRAMO-J-007'],
  ['epis2-pharmacy-crash-cart', '167', 'MF-TRAMO-J-008'],
  ['epis2-pharmacy-controlled-substances', '168', 'MF-TRAMO-J-009'],
  ['epis2-pharmacy-return', '169', 'MF-TRAMO-J-010'],
  ['epis2-pharmacy-stockout', '170', 'MF-TRAMO-J-011'],
];

for (const [testid, idc, mf] of panels) {
  if (!panel.includes(testid)) errors.push(`PharmacyDashboardTab sin ${testid}`);
  if (!api.includes(`idc: ${idc}`)) errors.push(`pharmacy.ts sin IDC ${idc} active`);
  if (!matrix.includes(mf)) errors.push(`matriz sin ${mf}`);
}

const e2e = readFileSync(join(root, 'e2e/tramo-j-pharmacy.spec.ts'), 'utf8');
if (!e2e.includes('epis2-pharmacy-tdm')) errors.push('e2e sin journey TDM');
if (!e2e.includes('epis2-pharmacy-stockout')) errors.push('e2e sin journey quiebre stock');
if (!e2e.includes('epis2-pharmacy-idc-170')) errors.push('e2e sin chip IDC 170');

if (errors.length) {
  console.error('tramo-j-scaffold-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-j-scaffold-gate OK — paneles demo IDC 162–170');
