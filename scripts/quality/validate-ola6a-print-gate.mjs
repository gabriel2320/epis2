#!/usr/bin/env node
/** MF-OLA6A-002 — Vista Print A5 certificado + receta (IDC 40 / receta A5). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'packages/epis2-ui/src/print/PrintA5Document.tsx',
  'packages/epis2-ui/src/print/PrintLetterDocument.tsx',
  'apps/web/src/pages/MedicalCertificatePrintPage.tsx',
  'apps/web/src/pages/PrescriptionPrintPage.tsx',
  'apps/web/src/pages/DischargeSummaryPrintPage.tsx',
  'apps/web/src/clinical/printPreviewStorage.ts',
  'e2e/ola6a-print-certificate.spec.ts',
  'e2e/ola6a-print-discharge-summary.spec.ts',
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
if (!form.includes('epis2-print-preview-prescription')) {
  errors.push('GeneratedClinicalFormPage sin botón vista impresión receta');
}
if (!form.includes('epis2-print-preview-discharge_summary')) {
  errors.push('GeneratedClinicalFormPage sin botón vista impresión epicrisis');
}

const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
if (!router.includes('/espacio/certificado/imprimir')) {
  errors.push('router sin ruta imprimir certificado');
}
if (!router.includes('/espacio/receta/imprimir')) {
  errors.push('router sin ruta imprimir receta');
}
if (!router.includes('/espacio/epicrisis/imprimir')) {
  errors.push('router sin ruta imprimir epicrisis');
}

const e2e = readFileSync(join(root, 'e2e/ola6a-print-certificate.spec.ts'), 'utf8');
if (!e2e.includes('epis2-print-a5-document')) {
  errors.push('e2e ola6a sin vista impresión A5');
}

const e2eLetter = readFileSync(join(root, 'e2e/ola6a-print-discharge-summary.spec.ts'), 'utf8');
if (!e2eLetter.includes('epis2-print-letter-document')) {
  errors.push('e2e ola6a sin vista impresión Carta');
}

if (errors.length) {
  console.error('ola6a-print-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ola6a-print-gate OK — Print A5 certificado + receta + Carta epicrisis (vista documental)');
