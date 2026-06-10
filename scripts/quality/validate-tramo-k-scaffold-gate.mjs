#!/usr/bin/env node
/** MF-TRAMO-K-003 … K-011 — Paneles calidad demo (IDC 172–180). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/QualityDashboardTab.tsx'), 'utf8');
const api = readFileSync(join(root, 'apps/api/src/dashboard/quality.ts'), 'utf8');
const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');

const panels = [
  ['epis2-quality-rca', '172', 'MF-TRAMO-K-003'],
  ['epis2-quality-mortality-board', '173', 'MF-TRAMO-K-004'],
  ['epis2-quality-record-audit', '174', 'MF-TRAMO-K-005'],
  ['epis2-quality-oirs', '175', 'MF-TRAMO-K-006'],
  ['epis2-quality-work-climate', '176', 'MF-TRAMO-K-007'],
  ['epis2-quality-consent-trace', '177', 'MF-TRAMO-K-008'],
  ['epis2-quality-accreditation', '178', 'MF-TRAMO-K-009'],
  ['epis2-quality-institutional-docs', '179', 'MF-TRAMO-K-010'],
  ['epis2-quality-surgical-suspension', '180', 'MF-TRAMO-K-011'],
];

for (const [testid, idc, mf] of panels) {
  if (!panel.includes(testid)) errors.push(`QualityDashboardTab sin ${testid}`);
  if (!api.includes(`idc: ${idc}`)) errors.push(`quality.ts sin IDC ${idc} active`);
  if (!matrix.includes(mf)) errors.push(`matriz sin ${mf}`);
}

const e2e = readFileSync(join(root, 'e2e/tramo-k-quality.spec.ts'), 'utf8');
if (!e2e.includes('epis2-quality-accreditation')) errors.push('e2e sin journey acreditación');
if (!e2e.includes('epis2-quality-surgical-suspension'))
  errors.push('e2e sin journey suspensión Qx');
if (!e2e.includes('epis2-quality-idc-180')) errors.push('e2e sin chip IDC 180');

if (errors.length) {
  console.error('tramo-k-scaffold-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-k-scaffold-gate OK — paneles demo IDC 172–180');
