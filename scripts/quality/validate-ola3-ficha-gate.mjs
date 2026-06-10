#!/usr/bin/env node
/**
 * MF-OLA3-002 — Valida evidencia mínima CTAs ficha longitudinal.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const requiredFiles = [
  'apps/web/src/components/PatientLongitudinalPanel.tsx',
  'apps/web/src/components/PatientLongitudinalPanel.test.tsx',
  'apps/web/src/components/PatientSummaryAntecedentsBlock.tsx',
  'apps/web/src/components/PatientSummaryAntecedentsBlock.test.tsx',
  'apps/web/src/components/PatientSummaryDocumentsBlock.tsx',
  'apps/web/src/components/PatientSummaryDocumentsBlock.test.tsx',
  'e2e/ola3-ficha-journey.spec.ts',
];

for (const rel of requiredFiles) {
  if (!existsSync(join(root, rel))) {
    errors.push(`falta archivo gate: ${rel}`);
  }
}

const panel = readFileSync(
  join(root, 'apps/web/src/components/PatientLongitudinalPanel.tsx'),
  'utf8',
);
for (const token of [
  'onRegisterAllergy',
  'onRegisterProblem',
  'onOpenResults',
  'epis2-longitudinal-register-allergy',
  'epis2-longitudinal-register-problem',
  'epis2-longitudinal-open-results',
]) {
  if (!panel.includes(token)) {
    errors.push(`PatientLongitudinalPanel sin ${token}`);
  }
}

const compact = readFileSync(
  join(root, 'apps/web/src/components/PatientSummaryAntecedentsBlock.tsx'),
  'utf8',
);
for (const token of [
  'epis2-ficha-antecedents',
  'epis2-ficha-register-allergy',
  'epis2-ficha-register-problem',
  'onRegisterAllergy',
  'onRegisterProblem',
]) {
  if (!compact.includes(token)) {
    errors.push(`PatientSummaryAntecedentsBlock sin ${token}`);
  }
}

const workspace = readFileSync(join(root, 'apps/web/src/pages/PatientWorkspacePage.tsx'), 'utf8');
if (!workspace.includes('PatientSummaryAntecedentsBlock')) {
  errors.push('PatientWorkspacePage sin PatientSummaryAntecedentsBlock');
}
if (!workspace.includes('PatientSummaryDocumentsBlock')) {
  errors.push('PatientWorkspacePage sin PatientSummaryDocumentsBlock');
}

const documentsBlock = readFileSync(
  join(root, 'apps/web/src/components/PatientSummaryDocumentsBlock.tsx'),
  'utf8',
);
for (const token of [
  'epis2-ficha-documents',
  'epis2-ficha-open-documents-index',
  'onViewDocumentIndex',
]) {
  if (!documentsBlock.includes(token)) {
    errors.push(`PatientSummaryDocumentsBlock sin ${token}`);
  }
}

const e2e = readFileSync(join(root, 'e2e/ola3-ficha-journey.spec.ts'), 'utf8');
if (!e2e.includes('epis2-ficha-register-allergy')) {
  errors.push('e2e ola3 sin epis2-ficha-register-allergy');
}
if (!e2e.includes('epis2-ficha-documents')) {
  errors.push('e2e ola3 sin epis2-ficha-documents');
}

if (errors.length) {
  console.error('ola3-ficha-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('ola3-ficha-gate OK — evidencia estática Ola 3 CTAs presente');
