#!/usr/bin/env node
/** MF-TRAMO-H-003 … H-011 — Paneles IAAS demo (IDC 142–150). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/QualityDashboardTab.tsx'), 'utf8');
const api = readFileSync(join(root, 'apps/api/src/dashboard/quality.ts'), 'utf8');
const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');

const panels = [
  ['epis2-iaas-mdro-alert', '142', 'MF-TRAMO-H-003'],
  ['epis2-iaas-antimicrobial-monitor', '143', 'MF-TRAMO-H-004'],
  ['epis2-iaas-proa', '144', 'MF-TRAMO-H-005'],
  ['epis2-iaas-cvc-checklist', '145', 'MF-TRAMO-H-006'],
  ['epis2-iaas-nav-prevention', '146', 'MF-TRAMO-H-007'],
  ['epis2-iaas-hand-hygiene', '147', 'MF-TRAMO-H-008'],
  ['epis2-iaas-outbreak-study', '148', 'MF-TRAMO-H-009'],
  ['epis2-iaas-isolation-map', '149', 'MF-TRAMO-H-010'],
  ['epis2-iaas-endemic-curves', '150', 'MF-TRAMO-H-011'],
];

for (const [testid, idc, mf] of panels) {
  if (!panel.includes(testid)) errors.push(`QualityDashboardTab sin ${testid}`);
  if (!api.includes(`idc: ${idc}`)) errors.push(`quality.ts sin IDC ${idc} active`);
  if (!matrix.includes(mf)) errors.push(`matriz sin ${mf}`);
}

const e2e = readFileSync(join(root, 'e2e/tramo-h-iaas.spec.ts'), 'utf8');
if (!e2e.includes('epis2-iaas-mdro-alert')) errors.push('e2e sin journey alerta MDRO');
if (!e2e.includes('epis2-iaas-endemic-curves')) errors.push('e2e sin journey curvas endémicas');
if (!e2e.includes('epis2-iaas-idc-150')) errors.push('e2e sin chip IDC 150');

if (errors.length) {
  console.error('tramo-h-scaffold-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-h-scaffold-gate OK — paneles demo IDC 142–150');
