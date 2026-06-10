#!/usr/bin/env node
/** MF-OLA3-006 — Hub ficha paciente (IDC 21). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const e2e = readFileSync(join(root, 'e2e/ola3-ficha-journey.spec.ts'), 'utf8');
for (const token of [
  'epis2-patient-workspace',
  'epis2-ficha-antecedents',
  'epis2-ficha-documents',
  'epis2-ficha-history',
  'epis2-longitudinal-panel',
]) {
  if (!e2e.includes(token)) errors.push(`e2e ola3 sin ${token}`);
}

const workspaceTest = readFileSync(
  join(root, 'apps/web/src/pages/PatientWorkspacePage.test.tsx'),
  'utf8',
);
for (const token of [
  'epis2-ficha-antecedents',
  'epis2-ficha-documents',
  'epis2-longitudinal-panel',
  'epis2-ficha-history',
]) {
  if (!workspaceTest.includes(token)) {
    errors.push(`PatientWorkspacePage.test sin ${token}`);
  }
}

const workspacePage = readFileSync(
  join(root, 'apps/web/src/pages/PatientWorkspacePage.tsx'),
  'utf8',
);
if (!workspacePage.includes('PatientSummaryAntecedentsBlock')) {
  errors.push('PatientWorkspacePage sin bloque antecedentes compacto');
}
if (!workspacePage.includes('PatientSummaryDocumentsBlock')) {
  errors.push('PatientWorkspacePage sin bloque documentos compacto');
}

if (errors.length) {
  console.error('ola3-ficha-hub-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ola3-ficha-hub-gate OK — IDC 21 hub ficha UX-B.2');
