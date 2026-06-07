#!/usr/bin/env node
/** MF-TRAMO-E-004 — Evaluación preanestésica demo (IDC 153). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/OrDashboardTab.tsx'), 'utf8');
for (const token of [
  'epis2-or-preanesthesia',
  'epis2-or-preanesthesia-rows',
  'copy.or.preanesthesiaTitle',
]) {
  if (!panel.includes(token)) errors.push(`OrDashboardTab sin ${token}`);
}

const api = readFileSync(join(root, 'apps/api/src/dashboard/or.ts'), 'utf8');
if (!api.includes('preanesthesiaEvaluations') || !api.includes("idc: 153")) {
  errors.push('or.ts sin preanesthesiaEvaluations o IDC 153 active');
}

const e2e = readFileSync(join(root, 'e2e/tramo-e-or.spec.ts'), 'utf8');
if (!e2e.includes('epis2-or-preanesthesia')) errors.push('e2e tramo-e-or sin journey preanestesia');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-E-004')) errors.push('IDC 153 sin nota MF-TRAMO-E-004');

if (errors.length) {
  console.error('tramo-e-preanesthesia-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-e-preanesthesia-gate OK — evaluación preanestésica demo (IDC 153)');
