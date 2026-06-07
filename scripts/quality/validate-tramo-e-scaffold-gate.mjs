#!/usr/bin/env node
/** MF-TRAMO-E-005 … E-011 — Paneles pabellón demo (IDC 154–160). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/OrDashboardTab.tsx'), 'utf8');
const panels = [
  ['epis2-or-intraop-anesthesia', '154', 'MF-TRAMO-E-005'],
  ['epis2-or-operative-protocol', '155', 'MF-TRAMO-E-006'],
  ['epis2-or-sponge-count', '156', 'MF-TRAMO-E-007'],
  ['epis2-or-intraop-biopsy', '157', 'MF-TRAMO-E-008'],
  ['epis2-or-urpa-recovery', '158', 'MF-TRAMO-E-009'],
  ['epis2-or-blood-bank', '159', 'MF-TRAMO-E-010'],
  ['epis2-or-sterilization', '160', 'MF-TRAMO-E-011'],
];
for (const [testid, idc, mf] of panels) {
  if (!panel.includes(testid)) errors.push(`OrDashboardTab sin ${testid}`);
  const api = readFileSync(join(root, 'apps/api/src/dashboard/or.ts'), 'utf8');
  if (!api.includes(`idc: ${idc}`)) errors.push(`or.ts sin IDC ${idc} active`);
  const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
  if (!matrix.includes(mf)) errors.push(`matriz sin ${mf}`);
}

const e2e = readFileSync(join(root, 'e2e/tramo-e-or.spec.ts'), 'utf8');
if (!e2e.includes('epis2-or-intraop-anesthesia')) errors.push('e2e sin journey anestesia intraop');
if (!e2e.includes('epis2-or-sterilization')) errors.push('e2e sin journey esterilización');

if (errors.length) {
  console.error('tramo-e-scaffold-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-e-scaffold-gate OK — paneles demo IDC 154–160');
