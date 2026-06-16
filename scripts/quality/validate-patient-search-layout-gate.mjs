#!/usr/bin/env node
/** PR-AEST-PATIENT-SEARCH-01 — composición limpia /espacio/buscar-paciente */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const screen = readFileSync(join(root, 'apps/web/src/pages/PatientSearchScreen.tsx'), 'utf8');
const shell = readFileSync(join(root, 'apps/web/src/layouts/ClinicalShellLayout.tsx'), 'utf8');
const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
const formPage = readFileSync(join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'), 'utf8');
const engine = readFileSync(
  join(root, 'packages/epis2-ui/src/layout/clinical/clinicalLayoutEngine.ts'),
  'utf8',
);

const forbiddenInScreen = [
  ['ShiftContextStrip', 'Turno clínico sintético en búsqueda'],
  ['EpisModeSwitcher', 'Selector Centro/Ficha/Dashboard'],
  ['ChartEspacioCommandDock', 'Barra NL duplicada'],
  ['EpisAppScaffold', 'Scaffold con sidebar en búsqueda'],
  ['Modo tablero', 'Modo tablero en búsqueda'],
  ['threeModes.dashboardLabel', 'Tab Dashboard'],
  ['PatientListGrid', 'Grid con gráficos en búsqueda'],
  ['EpisClinicalFormRhf', 'Formulario blueprint duplicado'],
  ['PatientSearchAutocomplete', 'Segundo input autocomplete'],
  ['EpisClinicalFormPage', 'Wrapper formulario legacy'],
];

for (const [token, msg] of forbiddenInScreen) {
  if (screen.includes(token)) {
    errors.push(`PatientSearchScreen contiene ${token} — ${msg}`);
  }
}

for (const token of [
  'PatientSearchScreen',
  'profile="patient-search"',
  'epis2-patient-search-hero-input',
  'PatientSearchResults',
]) {
  if (!screen.includes(token)) {
    errors.push(`PatientSearchScreen falta ${token}`);
  }
}

if ((screen.match(/variant="contained"/g) ?? []).length > 1) {
  errors.push('Más de un botón primario contained visible');
}

if (!shell.includes('isDualChartMinimalShell') && !shell.includes('isPatientSearch')) {
  errors.push('ClinicalShellLayout sin shell mínimo dual ficha / búsqueda');
}

if (!router.includes('component: PatientSearchScreen')) {
  errors.push('router debe usar PatientSearchScreen en /espacio/buscar-paciente');
}

if (formPage.includes('ShiftContextStrip')) {
  errors.push('GeneratedClinicalFormPage aún referencia ShiftContextStrip');
}
if (formPage.includes('PatientSearchAutocomplete')) {
  errors.push('GeneratedClinicalFormPage aún referencia PatientSearchAutocomplete');
}

if (!engine.includes("'patient-search'")) {
  errors.push('clinicalLayoutEngine sin profile patient-search');
}

if (!readFileSync(join(root, 'packages/design-system/src/copy/es.ts'), 'utf8').includes('patientSearch:')) {
  errors.push('copy es.ts sin bloque patientSearch');
}

if (errors.length) {
  console.error(
    'patient-search-layout-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('patient-search-layout-gate OK — PR-AEST-PATIENT-SEARCH-01 composición limpia');
