#!/usr/bin/env node
/** MF-OLA3-004 — Antecedentes ficha (IDC 27–29). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'packages/clinical-forms/src/blueprints/allergy-entry.ts',
  'packages/clinical-forms/src/blueprints/clinical-problem-entry.ts',
  'apps/web/src/components/PatientSummaryAntecedentsBlock.tsx',
  'e2e/ola3-ficha-journey.spec.ts',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta: ${rel}`);
}

const e2e = readFileSync(join(root, 'e2e/ola3-ficha-journey.spec.ts'), 'utf8');
for (const token of [
  'epis2-ficha-register-allergy',
  'epis2-ficha-antecedents',
  'epis2-form-allergy_entry',
  'epis2-form-clinical_problem_entry',
]) {
  if (!e2e.includes(token)) errors.push(`e2e ola3 sin ${token}`);
}

const rad = readFileSync(join(root, 'apps/web/src/design/radScreenRegistry.ts'), 'utf8');
if (!rad.includes('IDC 21–29')) {
  errors.push('radScreenRegistry patient-chart sin notas IDC 21–29');
}

if (errors.length) {
  console.error('ola3-longitudinal-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ola3-longitudinal-gate OK — IDC 27–29 evidencia E2E + RAD');
