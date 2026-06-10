#!/usr/bin/env node
/** MF-TRAMO-D-011 — Titulación vasoactivos demo (IDC 48). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/IcuDashboardTab.tsx'), 'utf8');
for (const token of [
  'epis2-icu-vasoactive',
  'epis2-icu-vasoactive-rows',
  'copy.icu.vasoactiveTitle',
]) {
  if (!panel.includes(token)) errors.push(`IcuDashboardTab sin ${token}`);
}

const api = readFileSync(join(root, 'apps/api/src/dashboard/icu.ts'), 'utf8');
if (!api.includes('vasoactive') || !api.includes('idc: 48')) {
  errors.push('icu.ts sin vasoactive o IDC 48 active');
}

const e2e = readFileSync(join(root, 'e2e/tramo-d-icu.spec.ts'), 'utf8');
if (!e2e.includes('epis2-icu-vasoactive')) errors.push('e2e tramo-d sin journey vasoactivos');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-D-011')) errors.push('IDC 48 sin nota MF-TRAMO-D-011');

if (errors.length) {
  console.error('tramo-d-vasoactive-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-d-vasoactive-gate OK — titulación vasoactivos demo (IDC 48)');
