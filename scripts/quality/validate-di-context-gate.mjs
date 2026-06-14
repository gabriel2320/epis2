#!/usr/bin/env node
/** MF-DI-01 — Contexto clínico denso en ficha dual chart. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'packages/clinical-domain/src/clinicalContextDense.ts',
  'packages/clinical-domain/src/clinicalContextDense.test.ts',
  'apps/web/src/components/chart/ClinicalContextDenseStrip.tsx',
  'apps/web/src/components/chart/ClinicalContextDenseStrip.test.tsx',
  'apps/api/src/clinical/patientContextDense.ts',
  'scripts/quality/validate-di-context-gate.mjs',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const shell = readFileSync(join(root, 'apps/web/src/components/chart/ClinicalShell.tsx'), 'utf8');
if (!shell.includes('contextDenseStrip')) {
  errors.push('ClinicalShell.tsx debe aceptar prop contextDenseStrip');
}

const dual = readFileSync(join(root, 'apps/web/src/pages/DualChartPatientPage.tsx'), 'utf8');
for (const token of ['ClinicalContextDenseStrip', 'buildClinicalContextDense', 'contextDenseStrip']) {
  if (!dual.includes(token)) errors.push(`DualChartPatientPage.tsx sin ${token}`);
}

const routes = readFileSync(join(root, 'apps/api/src/clinical/routes.ts'), 'utf8');
if (!routes.includes('/context-dense')) {
  errors.push('routes.ts debe exponer GET /api/patients/:patientId/context-dense');
}

const copyEs = readFileSync(join(root, 'packages/design-system/src/copy/es.ts'), 'utf8');
if (!copyEs.includes('contextDense:')) {
  errors.push('copy/es.ts debe incluir sección contextDense');
}

const e2e = readFileSync(join(root, 'e2e/dual-chart-modes.spec.ts'), 'utf8');
if (!e2e.includes('epis2-clinical-context-dense-strip')) {
  errors.push('e2e/dual-chart-modes.spec.ts debe verificar context dense strip');
}

const domainTest = spawnSync('npm', ['run', 'test', '--', '--run', 'packages/clinical-domain/src/clinicalContextDense.test.ts'], {
  cwd: root,
  shell: true,
  encoding: 'utf8',
});
if (domainTest.status !== 0) {
  errors.push('clinicalContextDense.test.ts falló');
}

const stripTest = spawnSync(
  'npm',
  ['run', 'test', '--', '--run', 'apps/web/src/components/chart/ClinicalContextDenseStrip.test.tsx'],
  { cwd: root, shell: true, encoding: 'utf8' },
);
if (stripTest.status !== 0) {
  errors.push('ClinicalContextDenseStrip.test.tsx falló');
}

if (errors.length) {
  console.error('quality:di-context-gate — FALLO');
  for (const e of errors) console.error(`  · ${e}`);
  process.exit(1);
}

console.log('quality:di-context-gate — OK (MF-DI-01)');
