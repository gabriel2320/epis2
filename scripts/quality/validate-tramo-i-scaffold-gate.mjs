#!/usr/bin/env node
/** MF-TRAMO-I-003 … I-011 — Paneles especialidades demo (IDC 182–190). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/SpecialtyDashboardTab.tsx'), 'utf8');
const api = readFileSync(join(root, 'apps/api/src/dashboard/specialty.ts'), 'utf8');
const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');

const panels = [
  ['epis2-specialty-oncology-board', '182', 'MF-TRAMO-I-003'],
  ['epis2-specialty-odontogram', '183', 'MF-TRAMO-I-004'],
  ['epis2-specialty-endoscopy', '184', 'MF-TRAMO-I-005'],
  ['epis2-specialty-ophthalmology', '185', 'MF-TRAMO-I-006'],
  ['epis2-specialty-hemodialysis', '186', 'MF-TRAMO-I-007'],
  ['epis2-specialty-kinesiology', '187', 'MF-TRAMO-I-008'],
  ['epis2-specialty-nutrition', '188', 'MF-TRAMO-I-009'],
  ['epis2-specialty-chemotherapy', '189', 'MF-TRAMO-I-010'],
  ['epis2-specialty-psychiatry', '190', 'MF-TRAMO-I-011'],
];

for (const [testid, idc, mf] of panels) {
  if (!panel.includes(testid)) errors.push(`SpecialtyDashboardTab sin ${testid}`);
  if (!api.includes(`idc: ${idc}`)) errors.push(`specialty.ts sin IDC ${idc} active`);
  if (!matrix.includes(mf)) errors.push(`matriz sin ${mf}`);
}

const e2e = readFileSync(join(root, 'e2e/tramo-i-specialty.spec.ts'), 'utf8');
if (!e2e.includes('epis2-specialty-odontogram')) errors.push('e2e sin journey odontograma');
if (!e2e.includes('epis2-specialty-psychiatry')) errors.push('e2e sin journey psiquiatría');
if (!e2e.includes('epis2-specialty-idc-190')) errors.push('e2e sin chip IDC 190');

if (errors.length) {
  console.error('tramo-i-scaffold-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-i-scaffold-gate OK — paneles demo IDC 182–190');
