#!/usr/bin/env node
/**
 * MF-OLA6A-002 / PEND-006 — Vistas documentales print (norma EPIS2_PRINTABLE_CLINICAL_DOCUMENTS_NORM).
 * A5: certificado, receta, orden laboratorio, orden imagenología · Carta: epicrisis.
 */
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
  'apps/web/src/pages/LabRequestPrintPage.tsx',
  'apps/web/src/pages/ImagingRequestPrintPage.tsx',
  'apps/web/src/clinical/printPreviewStorage.ts',
  'apps/web/src/clinical/print/usePrintPagePatient.ts',
  'apps/web/src/clinical/print/PrintPageToolbar.tsx',
  'apps/web/src/clinical/print/printableBlueprints.ts',
  'e2e/ola6a-print-certificate.spec.ts',
  'e2e/ola6a-print-discharge-summary.spec.ts',
  'e2e/ola6a-print-orders.spec.ts',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta: ${rel}`);
}

// El CTA de impresión es genérico y se alimenta del registry PRINTABLE_BLUEPRINTS.
const form = readFileSync(
  join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'),
  'utf8',
);
if (!form.includes('PRINTABLE_BLUEPRINTS') || !form.includes('epis2-print-preview-')) {
  errors.push('GeneratedClinicalFormPage sin CTA de impresión basado en PRINTABLE_BLUEPRINTS');
}

const registry = readFileSync(
  join(root, 'apps/web/src/clinical/print/printableBlueprints.ts'),
  'utf8',
);
for (const blueprintId of [
  'medical_certificate',
  'prescription',
  'discharge_summary',
  'lab_request',
  'imaging_request',
]) {
  if (!registry.includes(`${blueprintId}:`)) {
    errors.push(`printableBlueprints sin entrada ${blueprintId}`);
  }
}

const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
for (const route of [
  '/espacio/certificado/imprimir',
  '/espacio/receta/imprimir',
  '/espacio/epicrisis/imprimir',
  '/espacio/laboratorio/imprimir',
  '/espacio/imagenologia/imprimir',
]) {
  if (!router.includes(route)) {
    errors.push(`router sin ruta ${route}`);
  }
}

const e2e = readFileSync(join(root, 'e2e/ola6a-print-certificate.spec.ts'), 'utf8');
if (!e2e.includes('epis2-print-a5-document')) {
  errors.push('e2e ola6a sin vista impresión A5');
}

const e2eLetter = readFileSync(join(root, 'e2e/ola6a-print-discharge-summary.spec.ts'), 'utf8');
if (!e2eLetter.includes('epis2-print-letter-document')) {
  errors.push('e2e ola6a sin vista impresión Carta');
}

const e2eOrders = readFileSync(join(root, 'e2e/ola6a-print-orders.spec.ts'), 'utf8');
if (!e2eOrders.includes('epis2-lab-request-print-page') || !e2eOrders.includes('epis2-imaging-request-print-page')) {
  errors.push('e2e ola6a órdenes sin vistas lab/imagen');
}

if (errors.length) {
  console.error('ola6a-print-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log(
  'ola6a-print-gate OK — Print A5 (certificado, receta, lab, imagen) + Carta (epicrisis) sobre registry único',
);
