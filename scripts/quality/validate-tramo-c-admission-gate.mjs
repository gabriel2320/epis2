#!/usr/bin/env node
/** MF-TRAMO-C-003 — Hub hospitalización ficha + ingreso blueprint UI. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(
  join(root, 'apps/web/src/components/PatientLongitudinalPanel.tsx'),
  'utf8',
);
for (const token of [
  'epis2-longitudinal-hospitalization',
  'epis2-longitudinal-admit-hospital',
  'epis2-longitudinal-transfer-note',
  'epis2-longitudinal-nursing-note',
]) {
  if (!panel.includes(token)) errors.push(`PatientLongitudinalPanel sin ${token}`);
}

const workspace = readFileSync(
  join(root, 'apps/web/src/pages/PatientWorkspacePage.tsx'),
  'utf8',
);
if (!workspace.includes("'/espacio/ingreso'")) {
  errors.push('PatientWorkspacePage sin quick action ingreso');
}

const e2e = readFileSync(join(root, 'e2e/tramo-c-admission.spec.ts'), 'utf8');
if (!e2e.includes('epis2-form-admission_note')) {
  errors.push('e2e tramo-c sin journey ingreso');
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes("111: { estado: 'Done'")) {
  errors.push('IDC 111 no promovido a Done');
}

if (errors.length) {
  console.error('tramo-c-admission-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-c-admission-gate OK — hub hospitalización + ingreso UI');
