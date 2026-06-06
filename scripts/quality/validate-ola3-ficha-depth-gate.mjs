#!/usr/bin/env node
/** MF-OLA3-005 — Ficha profundidad longitudinal (IDC 23–26). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const token of [
  'epis2-longitudinal-timeline',
  'epis2-longitudinal-medications',
  'epis2-longitudinal-observations',
]) {
  const panel = readFileSync(
    join(root, 'apps/web/src/components/PatientLongitudinalPanel.tsx'),
    'utf8',
  );
  if (!panel.includes(token)) errors.push(`PatientLongitudinalPanel sin ${token}`);
}

const charts = readFileSync(
  join(root, 'apps/web/src/components/PatientClinicalCharts.tsx'),
  'utf8',
);
if (!charts.includes('epis2-patient-clinical-charts')) {
  errors.push('PatientClinicalCharts sin epis2-patient-clinical-charts');
}

const e2e = readFileSync(join(root, 'e2e/ola3-ficha-journey.spec.ts'), 'utf8');
for (const token of [
  'epis2-longitudinal-timeline',
  'Losartán',
  'epis2-chart-vitals-trend',
]) {
  if (!e2e.includes(token)) errors.push(`e2e ola3 sin ${token}`);
}

if (errors.length) {
  console.error('ola3-ficha-depth-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ola3-ficha-depth-gate OK — IDC 23–26 evidencia ficha');
