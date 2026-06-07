#!/usr/bin/env node
/** MF-OLA6A-002 — Vista Print A5 certificado (IDC 40 Done). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'packages/epis2-ui/src/print/PrintA5Document.tsx',
  'apps/web/src/pages/MedicalCertificatePrintPage.tsx',
  'apps/web/src/clinical/printPreviewStorage.ts',
  'e2e/ola6a-print-certificate.spec.ts',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta: ${rel}`);
}

const form = readFileSync(
  join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'),
  'utf8',
);
if (!form.includes('epis2-print-preview-medical_certificate')) {
  errors.push('GeneratedClinicalFormPage sin botón vista impresión certificado');
}

const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
if (!router.includes('/espacio/certificado/imprimir')) {
  errors.push('router sin ruta imprimir certificado');
}

const e2e = readFileSync(join(root, 'e2e/ola6a-print-certificate.spec.ts'), 'utf8');
if (!e2e.includes('epis2-print-a5-document')) {
  errors.push('e2e ola6a sin vista impresión A5');
}

if (errors.length) {
  console.error('ola6a-print-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ola6a-print-gate OK — Print A5 certificado (vista documental)');
