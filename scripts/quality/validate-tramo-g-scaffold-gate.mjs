#!/usr/bin/env node
/** MF-TRAMO-G-003 … G-010 — Paneles UCI especializada demo (IDC 132–140). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/IcuDashboardTab.tsx'), 'utf8');
const api = readFileSync(join(root, 'apps/api/src/dashboard/icu.ts'), 'utf8');
const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');

const panels = [
  ['epis2-icu-renal-therapy', '132', 'MF-TRAMO-G-003'],
  ['epis2-icu-parenteral-nutrition', '133', 'MF-TRAMO-G-004'],
  ['epis2-icu-enteral-nutrition', '134', 'MF-TRAMO-G-005'],
  ['epis2-icu-brain-death', '136', 'MF-TRAMO-G-006'],
  ['epis2-icu-organ-procurement', '137', 'MF-TRAMO-G-007'],
  ['epis2-icu-diary', '138', 'MF-TRAMO-G-008'],
  ['epis2-icu-delirium', '139', 'MF-TRAMO-G-009'],
  ['epis2-icu-prone-protocol', '140', 'MF-TRAMO-G-010'],
];

for (const [testid, idc, mf] of panels) {
  if (!panel.includes(testid)) errors.push(`IcuDashboardTab sin ${testid}`);
  if (!api.includes(`idc: ${idc}`)) errors.push(`icu.ts sin IDC ${idc} active`);
  if (!matrix.includes(mf)) errors.push(`matriz sin ${mf}`);
}

if (!api.includes('idc: 135')) errors.push('icu.ts sin IDC 135 en specialized panels');

const e2e = readFileSync(join(root, 'e2e/tramo-g-icu.spec.ts'), 'utf8');
if (!e2e.includes('epis2-icu-renal-therapy')) errors.push('e2e sin journey terapias renales');
if (!e2e.includes('epis2-icu-prone-protocol')) errors.push('e2e sin journey decúbito prono');
if (!e2e.includes('epis2-icu-idc-140')) errors.push('e2e sin chip IDC 140');

if (errors.length) {
  console.error('tramo-g-scaffold-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-g-scaffold-gate OK — paneles demo IDC 132–140');
