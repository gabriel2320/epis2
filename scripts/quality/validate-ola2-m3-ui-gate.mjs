#!/usr/bin/env node
/**
 * MF-OLA2-001 — Valida evidencia mínima del gate M3-UI Ola 2.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const requiredFiles = [
  'packages/clinical-forms/src/scrollspy-blueprints.ts',
  'packages/clinical-forms/src/blueprints/outpatient-visit.ts',
  'packages/clinical-forms/src/blueprints/medical-certificate.ts',
  'apps/web/src/pages/GeneratedClinicalFormPage.ola2.test.tsx',
  'e2e/ola2-ambulatory-m3-ui.spec.ts',
];

for (const rel of requiredFiles) {
  if (!existsSync(join(root, rel))) {
    errors.push(`falta archivo gate: ${rel}`);
  }
}

const pageSrc = readFileSync(
  join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'),
  'utf8',
);
if (!pageSrc.includes('usesScrollspyShell')) {
  errors.push('GeneratedClinicalFormPage no usa usesScrollspyShell');
}
if (!pageSrc.includes('blueprintUsesScrollspyLayout')) {
  errors.push('GeneratedClinicalFormPage no enlaza scrollspy ambulatorio');
}

const outpatient = readFileSync(
  join(root, 'packages/clinical-forms/src/blueprints/outpatient-visit.ts'),
  'utf8',
);
for (const token of ['closeEncounter', 'icd10Code', 'patientSummaryForPatient', 'physicalExamGeneral']) {
  if (!outpatient.includes(token)) {
    errors.push(`outpatient_visit sin campo ${token}`);
  }
}

if (errors.length) {
  console.error('ola2-m3-ui-gate FAIL\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('ola2-m3-ui-gate OK — evidencia estática Ola 2 presente');
