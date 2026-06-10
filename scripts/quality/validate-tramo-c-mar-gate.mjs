#!/usr/bin/env node
/** MF-TRAMO-C-008 — MAR enfermería ficha + tablero + formulario. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(
  join(root, 'apps/web/src/components/PatientLongitudinalPanel.tsx'),
  'utf8',
);
if (!panel.includes('epis2-longitudinal-open-nursing-mar')) {
  errors.push('PatientLongitudinalPanel sin CTA bandeja MAR');
}

const nursing = readFileSync(join(root, 'apps/web/src/components/NursingDashboardTab.tsx'), 'utf8');
if (!nursing.includes('epis2-nursing-register-mar-')) {
  errors.push('NursingDashboardTab sin CTA registrar MAR');
}

const dashboard = readFileSync(
  join(root, 'apps/web/src/dashboard/DashboardModeContent.tsx'),
  'utf8',
);
if (!dashboard.includes("to: '/espacio/mar'")) {
  errors.push('DashboardModeContent sin navegación MAR');
}

const e2e = readFileSync(join(root, 'e2e/tramo-c-mar.spec.ts'), 'utf8');
if (!e2e.includes('epis2-form-medication_administration')) {
  errors.push('e2e tramo-c-mar sin journey MAR');
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-C-008')) {
  errors.push('IDC 116 sin nota MF-TRAMO-C-008');
}

if (errors.length) {
  console.error('tramo-c-mar-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-c-mar-gate OK — MAR enfermería (IDC 116)');
