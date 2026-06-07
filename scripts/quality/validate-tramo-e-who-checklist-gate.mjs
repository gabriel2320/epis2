#!/usr/bin/env node
/** MF-TRAMO-E-003 — Checklist cirugía segura OMS demo (IDC 152). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/OrDashboardTab.tsx'), 'utf8');
for (const token of [
  'epis2-or-who-checklist',
  'epis2-or-who-checklist-rows',
  'copy.or.whoChecklistTitle',
]) {
  if (!panel.includes(token)) errors.push(`OrDashboardTab sin ${token}`);
}

const api = readFileSync(join(root, 'apps/api/src/dashboard/or.ts'), 'utf8');
if (!api.includes('whoSafetyChecklist') || !api.includes("idc: 152")) {
  errors.push('or.ts sin whoSafetyChecklist o IDC 152 active');
}

const e2e = readFileSync(join(root, 'e2e/tramo-e-or.spec.ts'), 'utf8');
if (!e2e.includes('epis2-or-who-checklist')) errors.push('e2e tramo-e-or sin journey checklist OMS');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-E-003')) errors.push('IDC 152 sin nota MF-TRAMO-E-003');

if (errors.length) {
  console.error('tramo-e-who-checklist-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-e-who-checklist-gate OK — checklist OMS demo (IDC 152)');
