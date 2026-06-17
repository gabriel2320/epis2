#!/usr/bin/env node
/** CICA Clean Room — cierre compuesto PR1 foundation + formularios/secciones PR7. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const gates = [
  'validate-cica-no-legacy-shell-gate.mjs',
  'validate-cica-no-dashboard-mode-gate.mjs',
  'validate-cica-screen-registry-gate.mjs',
  'validate-cica-epis2g-structure-gate.mjs',
  'validate-cica-action-density-gate.mjs',
  'validate-cica-paper-standalone-gate.mjs',
  'validate-cica-responsive-gate.mjs',
];

for (const script of gates) {
  const r = spawnSync('node', [join(root, 'scripts/quality', script)], {
    cwd: root,
    encoding: 'utf8',
  });
  if (r.status !== 0) {
    errors.push(`${script} falló:\n${r.stdout ?? ''}${r.stderr ?? ''}`);
  }
}

const env = readFileSync(join(root, 'apps/web/src/dev/cicaUiEnv.ts'), 'utf8');
if (!env.includes('VITE_ENABLE_CICA_UI')) {
  errors.push('Falta VITE_ENABLE_CICA_UI en cicaUiEnv.ts');
}

const home = readFileSync(join(root, 'apps/web/src/routes/home.ts'), 'utf8');
if (!home.includes('EPIS2_CICA_HOME')) {
  errors.push('home.ts sin EPIS2_CICA_HOME');
}

/** PR7 — formularios nuevos y secciones ficha sin stubs en SectionPages. */
const cicaWeb = 'apps/web/src/cica';
const requiredPages = [
  'CicaNewPrescriptionPage.tsx',
  'CicaNewDocumentPage.tsx',
  'CicaPatientOrdersPage.tsx',
  'CicaPatientExamsPage.tsx',
  'CicaPatientDocumentsPage.tsx',
];

for (const file of requiredPages) {
  const path = join(root, cicaWeb, file);
  if (!existsSync(path)) {
    errors.push(`Falta ${cicaWeb}/${file}`);
  }
}

const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
for (const importToken of ['CicaNewPrescriptionPage', 'CicaNewDocumentPage']) {
  if (!router.includes(importToken)) {
    errors.push(`router.tsx sin import ${importToken}`);
  }
}

const sectionPagesPath = join(root, cicaWeb, 'CicaPatientSectionPages.tsx');
const sectionPages = readFileSync(sectionPagesPath, 'utf8');
const stubScreenIds = ['patient-orders', 'patient-exams', 'patient-documents'];
for (const screenId of stubScreenIds) {
  if (sectionPages.includes(`screenId="${screenId}"`)) {
    errors.push(
      `CicaPatientSectionPages.tsx aún tiene stub screenId="${screenId}" — usar página dedicada`,
    );
  }
}
if (sectionPages.includes('export function CicaPatientOrdersPage')) {
  errors.push('CicaPatientSectionPages.tsx exporta CicaPatientOrdersPage stub');
}
if (sectionPages.includes('export function CicaPatientExamsPage')) {
  errors.push('CicaPatientSectionPages.tsx exporta CicaPatientExamsPage stub');
}
if (sectionPages.includes('export function CicaPatientDocumentsPage')) {
  errors.push('CicaPatientSectionPages.tsx exporta CicaPatientDocumentsPage stub');
}

if (errors.length) {
  console.error('cica-clean-room-close-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('cica-clean-room-close-gate OK — CICA Clean Room foundation + formularios');
