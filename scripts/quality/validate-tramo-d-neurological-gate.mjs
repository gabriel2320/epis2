#!/usr/bin/env node
/** MF-TRAMO-D-009 — Valoración neurológica demo (IDC 46). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/IcuDashboardTab.tsx'), 'utf8');
for (const token of [
  'epis2-icu-neurological',
  'epis2-icu-neurological-rows',
  'copy.icu.neurologicalTitle',
]) {
  if (!panel.includes(token)) errors.push(`IcuDashboardTab sin ${token}`);
}

const api = readFileSync(join(root, 'apps/api/src/dashboard/icu.ts'), 'utf8');
if (!api.includes('neurological') || !api.includes("idc: 46")) {
  errors.push('icu.ts sin neurological o IDC 46 active');
}

const e2e = readFileSync(join(root, 'e2e/tramo-d-icu.spec.ts'), 'utf8');
if (!e2e.includes('epis2-icu-neurological')) errors.push('e2e tramo-d sin journey neurológico');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-D-009')) errors.push('IDC 46 sin nota MF-TRAMO-D-009');

if (errors.length) {
  console.error('tramo-d-neurological-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-d-neurological-gate OK — valoración neurológica demo (IDC 46)');
