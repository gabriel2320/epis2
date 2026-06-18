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
if (!env.includes('CICA_UI_PRODUCT_STATUS')) {
  errors.push('cicaUiEnv.ts debe declarar CICA_UI_PRODUCT_STATUS');
}
if (!env.includes("CICA_UI_PRODUCT_STATUS: CicaUiProductStatus = 'go'")) {
  errors.push('cicaUiEnv.ts debe declarar CICA_UI_PRODUCT_STATUS = go');
}
if (!env.includes('VITE_DISABLE_CICA_UI')) {
  errors.push('cicaUiEnv.ts debe permitir opt-out dev (VITE_DISABLE_CICA_UI)');
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

/** MF-PONY-03 — secciones demo colapsadas en mapa + ruta genérica. */
const demoSectionsPath = join(root, cicaWeb, 'cicaPatientDemoSections.ts');
for (const rel of [`${cicaWeb}/cicaPatientDemoSections.ts`, `${cicaWeb}/CicaPatientDemoSectionRoutePage.tsx`]) {
  if (!existsSync(join(root, rel))) {
    errors.push(`Falta ${rel}`);
  }
}
const demoSections = readFileSync(demoSectionsPath, 'utf8');
for (const screenId of ['patient-discharge', 'patient-interconsultas', 'patient-procedures']) {
  if (!demoSections.includes(`'${screenId}'`)) {
    errors.push(`cicaPatientDemoSections.ts falta ${screenId}`);
  }
}
for (const legacyPage of [
  'CicaPatientDischargePage.tsx',
  'CicaPatientInterconsultasPage.tsx',
  'CicaPatientProceduresPage.tsx',
]) {
  if (existsSync(join(root, cicaWeb, legacyPage))) {
    errors.push(`Eliminar page fina obsoleta: ${cicaWeb}/${legacyPage}`);
  }
}
if (!router.includes('CicaPatientDemoSectionRoutePage')) {
  errors.push('router.tsx debe usar CicaPatientDemoSectionRoutePage para secciones demo');
}

if (errors.length) {
  console.error('cica-clean-room-close-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('cica-clean-room-close-gate OK — CICA Clean Room foundation + formularios');
