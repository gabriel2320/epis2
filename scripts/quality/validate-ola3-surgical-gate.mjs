#!/usr/bin/env node
/** MF-OLA3-007 — Antecedentes quirúrgicos (IDC 30). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const blueprint = readFileSync(
  join(root, 'packages/clinical-forms/src/blueprints/clinical-problem-entry.ts'),
  'utf8',
);
if (!blueprint.includes('problemCategory')) {
  errors.push('clinical_problem_entry sin problemCategory');
}

const panel = readFileSync(
  join(root, 'apps/web/src/components/PatientLongitudinalPanel.tsx'),
  'utf8',
);
for (const token of [
  'epis2-longitudinal-surgical-history',
  'epis2-longitudinal-register-surgical-history',
  'isSurgicalHistoryDescription',
]) {
  if (!panel.includes(token)) errors.push(`PatientLongitudinalPanel sin ${token}`);
}

const service = readFileSync(join(root, 'apps/api/src/clinical/service.ts'), 'utf8');
if (!service.includes('formatSurgicalHistoryDescription')) {
  errors.push('service sin formatSurgicalHistoryDescription');
}

const e2e = readFileSync(join(root, 'e2e/ola3-ficha-journey.spec.ts'), 'utf8');
if (!e2e.includes('epis2-longitudinal-register-surgical-history')) {
  errors.push('e2e ola3 sin CTA antecedente quirúrgico');
}

if (errors.length) {
  console.error('ola3-surgical-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ola3-surgical-gate OK — IDC 30 antecedentes quirúrgicos');
