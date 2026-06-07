#!/usr/bin/env node
/** MF-TRAMO-C-006 — Epicrisis desde tablero urgencias (IDC 110). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(
  join(root, 'apps/web/src/components/EmergencyDashboardTab.tsx'),
  'utf8',
);
for (const token of [
  'epis2-emergency-discharge-actions',
  'epis2-emergency-prepare-epicrisis-',
  'copy.emergency.prepareEpicrisis',
]) {
  if (!panel.includes(token)) errors.push(`EmergencyDashboardTab sin ${token}`);
}

const api = readFileSync(join(root, 'apps/api/src/dashboard/emergency.ts'), 'utf8');
if (!api.includes("idc: 110") || !api.includes("status: 'active'")) {
  errors.push('emergency.ts IDC 110 no active');
}
if (!api.includes('patientId:')) {
  errors.push('emergency.ts triage sin patientId');
}

const dashboard = readFileSync(
  join(root, 'apps/web/src/dashboard/DashboardModeContent.tsx'),
  'utf8',
);
if (!dashboard.includes("to: '/espacio/epicrisis'") || !dashboard.includes('EmergencyDashboardTab')) {
  errors.push('DashboardModeContent sin navegación epicrisis urgencias');
}

const e2e = readFileSync(join(root, 'e2e/tramo-c-emergency.spec.ts'), 'utf8');
if (!e2e.includes('epis2-emergency-prepare-epicrisis')) {
  errors.push('e2e tramo-c-emergency sin journey epicrisis');
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-C-006')) {
  errors.push('IDC 110 sin nota MF-TRAMO-C-006');
}

if (errors.length) {
  console.error('tramo-c-epicrisis-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-c-epicrisis-gate OK — CTA epicrisis urgencias (IDC 110)');
