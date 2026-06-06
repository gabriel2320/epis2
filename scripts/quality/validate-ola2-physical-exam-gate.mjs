#!/usr/bin/env node
/** MF-OLA2-003 — Examen físico + CIE-10 consulta ambulatoria (IDC 33–35). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const outpatient = readFileSync(
  join(root, 'packages/clinical-forms/src/blueprints/outpatient-visit.ts'),
  'utf8',
);
for (const token of [
  "section('physical-general'",
  "section('physical-segment'",
  "field('icd10Code'",
  'physicalExamGeneral',
  'physicalExamSegment',
]) {
  if (!outpatient.includes(token)) errors.push(`outpatient_visit sin ${token}`);
}

const scrollspyTest = readFileSync(
  join(root, 'packages/clinical-forms/src/scrollspy-blueprints.test.ts'),
  'utf8',
);
for (const id of ['physical-general', 'physical-segment', 'diagnosis']) {
  if (!scrollspyTest.includes(`'${id}'`)) {
    errors.push(`scrollspy-blueprints.test sin sección ${id}`);
  }
}

const unitTest = readFileSync(
  join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.ola2.test.tsx'),
  'utf8',
);
for (const token of [
  'epis2-scrollspy-physical-general',
  'epis2-scrollspy-physical-segment',
  'epis2-scrollspy-diagnosis',
  'Diagnóstico CIE-10',
]) {
  if (!unitTest.includes(token)) errors.push(`ola2 unit test sin ${token}`);
}

const e2e = readFileSync(join(root, 'e2e/ola2-ambulatory-m3-ui.spec.ts'), 'utf8');
if (!e2e.includes('IDC 33–35')) {
  errors.push('e2e ola2 sin journey examen físico + CIE-10');
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
for (const id of [33, 34, 35]) {
  if (!matrix.includes(`${id}: { estado: 'Done'`)) {
    errors.push(`IDC ${id} no promovido a Done en matriz`);
  }
}

if (errors.length) {
  console.error('ola2-physical-exam-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ola2-physical-exam-gate OK — IDC 33–35 examen físico + CIE-10');
