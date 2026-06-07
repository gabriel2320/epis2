#!/usr/bin/env node
/** MF-TRAMO-D-003 — Sábana clínica 24h demo (IDC 42). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/IcuDashboardTab.tsx'), 'utf8');
for (const token of ['epis2-icu-flowsheet', 'epis2-icu-flowsheet-hours', 'copy.icu.flowsheetTitle']) {
  if (!panel.includes(token)) errors.push(`IcuDashboardTab sin ${token}`);
}

const api = readFileSync(join(root, 'apps/api/src/dashboard/icu.ts'), 'utf8');
if (!api.includes('flowsheetHours')) errors.push('icu.ts sin flowsheetHours');

const e2e = readFileSync(join(root, 'e2e/tramo-d-icu.spec.ts'), 'utf8');
if (!e2e.includes('epis2-icu-flowsheet')) errors.push('e2e tramo-d sin journey flowsheet');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-D-003')) errors.push('IDC 42 sin nota MF-TRAMO-D-003');

if (errors.length) {
  console.error('tramo-d-flowsheet-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-d-flowsheet-gate OK — sábana clínica demo (IDC 42)');
