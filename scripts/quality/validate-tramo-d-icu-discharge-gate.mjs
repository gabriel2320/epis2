#!/usr/bin/env node
/** MF-TRAMO-D-008 — Epicrisis traslado UCI (IDC 50). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/IcuDashboardTab.tsx'), 'utf8');
for (const token of [
  'epis2-icu-discharge-actions',
  'epis2-icu-prepare-epicrisis-',
  'copy.icu.prepareUciDischarge',
]) {
  if (!panel.includes(token)) errors.push(`IcuDashboardTab sin ${token}`);
}

const dashboard = readFileSync(
  join(root, 'apps/web/src/dashboard/DashboardModeContent.tsx'),
  'utf8',
);
if (!dashboard.includes("to: '/espacio/epicrisis'") || !dashboard.includes('onOpenEpicrisis')) {
  errors.push('DashboardModeContent sin navegación epicrisis UCI');
}

const api = readFileSync(join(root, 'apps/api/src/dashboard/icu.ts'), 'utf8');
if (!api.includes("idc: 50") || !api.includes("status: 'active'")) {
  errors.push('icu.ts IDC 50 no active');
}

const e2e = readFileSync(join(root, 'e2e/tramo-d-icu.spec.ts'), 'utf8');
if (!e2e.includes('epis2-icu-prepare-epicrisis')) {
  errors.push('e2e tramo-d sin journey epicrisis UCI');
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-D-008')) errors.push('IDC 50 sin nota MF-TRAMO-D-008');

if (errors.length) {
  console.error('tramo-d-icu-discharge-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-d-icu-discharge-gate OK — epicrisis traslado UCI (IDC 50)');
