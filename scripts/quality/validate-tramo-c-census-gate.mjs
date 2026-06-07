#!/usr/bin/env node
/** MF-TRAMO-C-007 — Censo hospitalario desde ficha + tablero servicio. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(
  join(root, 'apps/web/src/components/PatientLongitudinalPanel.tsx'),
  'utf8',
);
if (!panel.includes('epis2-longitudinal-open-service-census')) {
  errors.push('PatientLongitudinalPanel sin CTA censo servicio');
}

const service = readFileSync(
  join(root, 'apps/web/src/components/ServiceDashboardTab.tsx'),
  'utf8',
);
for (const token of ['epis2-service-census', 'epis2-service-census-occupied', 'copy.inpatient.census']) {
  if (!service.includes(token)) errors.push(`ServiceDashboardTab sin ${token}`);
}

const e2e = readFileSync(join(root, 'e2e/tramo-c-admission.spec.ts'), 'utf8');
if (!e2e.includes('epis2-longitudinal-open-service-census')) {
  errors.push('e2e tramo-c-admission sin journey censo');
}

if (errors.length) {
  console.error('tramo-c-census-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-c-census-gate OK — censo hospitalario ficha + servicio');
