#!/usr/bin/env node
/** MF-TRAMO-D-004 — Monitorización hemodinámica demo (IDC 135). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/IcuDashboardTab.tsx'), 'utf8');
for (const token of ['epis2-icu-hemodynamics', 'idc === 135', 'copy.icu.hemodynamicsTitle']) {
  if (!panel.includes(token)) errors.push(`IcuDashboardTab sin ${token}`);
}

const api = readFileSync(join(root, 'apps/api/src/dashboard/icu.ts'), 'utf8');
if (!api.includes("idc: 135") || !api.includes("status: 'active'")) {
  errors.push('icu.ts IDC 135 no active');
}
if (!api.includes('hemodynamics')) errors.push('icu.ts sin hemodynamics');

const e2e = readFileSync(join(root, 'e2e/tramo-d-icu.spec.ts'), 'utf8');
if (!e2e.includes('epis2-icu-hemodynamics')) errors.push('e2e tramo-d sin journey hemodinámica');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-D-004')) errors.push('IDC 135 sin nota MF-TRAMO-D-004');

if (errors.length) {
  console.error('tramo-d-hemodynamics-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-d-hemodynamics-gate OK — hemodinámica demo (IDC 135)');
