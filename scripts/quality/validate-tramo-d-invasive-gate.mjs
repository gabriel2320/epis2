#!/usr/bin/env node
/** MF-TRAMO-D-007 — Vías venosas e invasivos demo (IDC 45). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/IcuDashboardTab.tsx'), 'utf8');
for (const token of [
  'epis2-icu-invasive-lines',
  'epis2-icu-invasive-lines-rows',
  'copy.icu.invasiveLinesTitle',
]) {
  if (!panel.includes(token)) errors.push(`IcuDashboardTab sin ${token}`);
}

const api = readFileSync(join(root, 'apps/api/src/dashboard/icu.ts'), 'utf8');
if (!api.includes('invasiveLines') || !api.includes("idc: 45")) {
  errors.push('icu.ts sin invasiveLines o IDC 45');
}

const e2e = readFileSync(join(root, 'e2e/tramo-d-icu.spec.ts'), 'utf8');
if (!e2e.includes('epis2-icu-invasive-lines')) errors.push('e2e tramo-d sin journey invasivos');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-D-007')) errors.push('IDC 45 sin nota MF-TRAMO-D-007');

if (errors.length) {
  console.error('tramo-d-invasive-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-d-invasive-gate OK — vías invasivas demo (IDC 45)');
