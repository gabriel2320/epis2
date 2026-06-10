#!/usr/bin/env node
/** MF-TRAMO-D-005 — Balance hídrico estricto demo (IDC 43). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/IcuDashboardTab.tsx'), 'utf8');
for (const token of [
  'epis2-icu-fluid-balance',
  'epis2-icu-fluid-balance-rows',
  'copy.icu.fluidBalanceTitle',
]) {
  if (!panel.includes(token)) errors.push(`IcuDashboardTab sin ${token}`);
}

const api = readFileSync(join(root, 'apps/api/src/dashboard/icu.ts'), 'utf8');
if (!api.includes('fluidBalance') || !api.includes('idc: 43')) {
  errors.push('icu.ts sin balance hídrico o IDC 43');
}

const e2e = readFileSync(join(root, 'e2e/tramo-d-icu.spec.ts'), 'utf8');
if (!e2e.includes('epis2-icu-fluid-balance'))
  errors.push('e2e tramo-d sin journey balance hídrico');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-D-005')) errors.push('IDC 43 sin nota MF-TRAMO-D-005');

if (errors.length) {
  console.error('tramo-d-fluid-balance-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-d-fluid-balance-gate OK — balance hídrico demo (IDC 43)');
