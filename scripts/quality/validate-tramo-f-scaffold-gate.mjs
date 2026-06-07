#!/usr/bin/env node
/** MF-TRAMO-F-003 … F-011 — Paneles APS demo (IDC 122–130). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/ApsDashboardTab.tsx'), 'utf8');
const api = readFileSync(join(root, 'apps/api/src/dashboard/aps.ts'), 'utf8');
const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');

const panels = [
  ['epis2-aps-framingham', '122', 'MF-TRAMO-F-003'],
  ['epis2-aps-preventive-exam', '123', 'MF-TRAMO-F-004'],
  ['epis2-aps-diabetic-foot', '124', 'MF-TRAMO-F-005'],
  ['epis2-aps-mental-health', '125', 'MF-TRAMO-F-006'],
  ['epis2-aps-child-wellness', '126', 'MF-TRAMO-F-007'],
  ['epis2-aps-immunization', '127', 'MF-TRAMO-F-008'],
  ['epis2-aps-prenatal', '128', 'MF-TRAMO-F-009'],
  ['epis2-aps-ministerial-referral', '129', 'MF-TRAMO-F-010'],
  ['epis2-aps-home-visit', '130', 'MF-TRAMO-F-011'],
];

for (const [testid, idc, mf] of panels) {
  if (!panel.includes(testid)) errors.push(`ApsDashboardTab sin ${testid}`);
  if (!api.includes(`idc: ${idc}`)) errors.push(`aps.ts sin IDC ${idc} active`);
  if (!matrix.includes(mf)) errors.push(`matriz sin ${mf}`);
}

const e2e = readFileSync(join(root, 'e2e/tramo-f-aps.spec.ts'), 'utf8');
if (!e2e.includes('epis2-aps-framingham')) errors.push('e2e sin journey Framingham');
if (!e2e.includes('epis2-aps-home-visit')) errors.push('e2e sin journey visita domiciliaria');

if (errors.length) {
  console.error('tramo-f-scaffold-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-f-scaffold-gate OK — paneles demo IDC 122–130');
