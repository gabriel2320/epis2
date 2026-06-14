#!/usr/bin/env node
/** MF-CU-02 / MF-CU-03 / MF-CU-04 — CDS Hooks patient-view + order-select + API /cds/cards. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const requiredCu02 = [
  'packages/clinical-domain/src/cdsHooks/mapClinicalAlertsToPatientViewCards.ts',
  'packages/clinical-domain/src/cdsHooks/mapClinicalAlertsToPatientViewCards.test.ts',
  'apps/web/src/components/cds/ClinicalPatientViewCdsPanel.tsx',
  'apps/web/src/components/cds/ClinicalPatientViewCdsPanel.test.tsx',
  'reports/epis2-mf-cu-02-patient-view.md',
];

const requiredCu03 = [
  'packages/clinical-domain/src/cdsHooks/mapClinicalAlertsToOrderSelectCards.ts',
  'packages/clinical-domain/src/cdsHooks/mapClinicalAlertsToOrderSelectCards.test.ts',
  'apps/web/src/pages/prescription/ClinicalOrderSelectCdsPanel.tsx',
  'apps/web/src/pages/prescription/ClinicalOrderSelectCdsPanel.test.tsx',
  'apps/api/src/routes/cds/routes.ts',
  'apps/api/src/routes/cds/orderSelect.integration.test.ts',
  'reports/epis2-mf-cu-03-order-select.md',
];

const requiredCu04 = [
  'packages/contracts/src/cdsCards.ts',
  'apps/api/src/routes/cds/cards.integration.test.ts',
  'reports/epis2-mf-cu-04-cds-api.md',
];

for (const rel of [...requiredCu02, ...requiredCu03, ...requiredCu04]) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const traditional = readFileSync(
  join(root, 'apps/web/src/components/chart/TraditionalEhrMode.tsx'),
  'utf8',
);
if (!traditional.includes('ClinicalPatientViewCdsPanel')) {
  errors.push('TraditionalEhrMode debe integrar ClinicalPatientViewCdsPanel');
}

const generatedForm = readFileSync(
  join(root, 'apps/web/src/clinical/generated-form/GeneratedFormSections.tsx'),
  'utf8',
);
if (!generatedForm.includes('ClinicalOrderSelectCdsPanel')) {
  errors.push('GeneratedFormSections debe integrar ClinicalOrderSelectCdsPanel para prescription');
}

const patientViewMapper = readFileSync(
  join(root, 'packages/clinical-domain/src/cdsHooks/mapClinicalAlertsToPatientViewCards.ts'),
  'utf8',
);
if (!patientViewMapper.includes("hook: 'patient-view'")) {
  errors.push('Mapper patient-view debe emitir hook patient-view');
}

const orderSelectMapper = readFileSync(
  join(root, 'packages/clinical-domain/src/cdsHooks/mapClinicalAlertsToOrderSelectCards.ts'),
  'utf8',
);
if (!orderSelectMapper.includes("hook: 'order-select'")) {
  errors.push('Mapper order-select debe emitir hook order-select');
}

const cdsRoutes = readFileSync(join(root, 'apps/api/src/routes/cds/routes.ts'), 'utf8');
if (!cdsRoutes.includes('/api/cds/order-select/:patientId')) {
  errors.push('API debe exponer GET /api/cds/order-select/:patientId');
}
if (!cdsRoutes.includes('/api/cds/cards/:patientId')) {
  errors.push('API debe exponer GET /api/cds/cards/:patientId');
}
if (!cdsRoutes.includes("app.post(\n    '/api/cds/cards'")) {
  errors.push('API debe exponer POST /api/cds/cards');
}

const cdsContracts = readFileSync(join(root, 'packages/contracts/src/cdsCards.ts'), 'utf8');
if (
  !cdsContracts.includes('cdsCardsRequestSchema') ||
  !cdsContracts.includes('cdsCardsResponseSchema')
) {
  errors.push('packages/contracts/src/cdsCards.ts debe definir request/response schemas');
}

const e2eDual = readFileSync(join(root, 'e2e/dual-chart-modes.spec.ts'), 'utf8');
if (!e2eDual.includes('epis2-cds-patient-view')) {
  errors.push('E2E dual-chart debe verificar panel patient-view CDS');
}

const e2eRx = readFileSync(join(root, 'e2e/ola6a-print-prescription.spec.ts'), 'utf8');
if (!e2eRx.includes('epis2-cds-order-select')) {
  errors.push('E2E receta debe verificar panel order-select CDS (DEMO-005)');
}

const ledger = JSON.parse(readFileSync(join(root, 'docs/quality/strengthen-ledger.json'), 'utf8'));
for (const id of ['MF-CU-02', 'MF-CU-03', 'MF-CU-04']) {
  const mf = ledger.phases?.find((m) => m.id === id);
  if (!mf || mf.state !== 'DONE') {
    errors.push(`strengthen-ledger.json: ${id} debe estar DONE`);
  }
}

const build = spawnSync('npm', ['run', 'build', '-w', '@epis2/clinical-domain'], {
  cwd: root,
  shell: true,
  encoding: 'utf8',
});
if (build.status !== 0) errors.push('build @epis2/clinical-domain falló');

for (const suite of [
  'packages/clinical-domain/src/cdsHooks/mapClinicalAlertsToPatientViewCards.test.ts',
  'packages/clinical-domain/src/cdsHooks/mapClinicalAlertsToOrderSelectCards.test.ts',
  'apps/web/src/components/cds/ClinicalPatientViewCdsPanel.test.tsx',
  'apps/web/src/pages/prescription/ClinicalOrderSelectCdsPanel.test.tsx',
]) {
  const run = spawnSync('npx', ['vitest', 'run', '--run', suite], {
    cwd: root,
    shell: true,
    encoding: 'utf8',
  });
  if (run.status !== 0) errors.push(`${suite} falló`);
}

if (errors.length) {
  console.error('quality:cds-hooks-gate — FALLO');
  for (const e of errors) console.error(`  · ${e}`);
  process.exit(1);
}

console.log(
  'quality:cds-hooks-gate — OK (MF-CU-02 patient-view + MF-CU-03 order-select + MF-CU-04 /cds/cards)',
);
