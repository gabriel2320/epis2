#!/usr/bin/env node
/** MF-CU-02 — CDS Hooks patient-view (cards al abrir ficha). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'packages/clinical-domain/src/cdsHooks/mapClinicalAlertsToPatientViewCards.ts',
  'packages/clinical-domain/src/cdsHooks/mapClinicalAlertsToPatientViewCards.test.ts',
  'apps/web/src/components/cds/ClinicalPatientViewCdsPanel.tsx',
  'apps/web/src/components/cds/ClinicalPatientViewCdsPanel.test.tsx',
  'reports/epis2-mf-cu-02-patient-view.md',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const traditional = readFileSync(
  join(root, 'apps/web/src/components/chart/TraditionalEhrMode.tsx'),
  'utf8',
);
if (!traditional.includes('ClinicalPatientViewCdsPanel')) {
  errors.push('TraditionalEhrMode debe integrar ClinicalPatientViewCdsPanel');
}

const mapper = readFileSync(
  join(root, 'packages/clinical-domain/src/cdsHooks/mapClinicalAlertsToPatientViewCards.ts'),
  'utf8',
);
if (!mapper.includes('mapClinicalAlertsToPatientViewCards')) {
  errors.push('Mapper mapClinicalAlertsToPatientViewCards incompleto');
}
if (!mapper.includes("hook: 'patient-view'")) {
  errors.push('Mapper debe emitir hook patient-view');
}

const e2e = readFileSync(join(root, 'e2e/dual-chart-modes.spec.ts'), 'utf8');
if (!e2e.includes('epis2-cds-patient-view')) {
  errors.push('E2E dual-chart debe verificar panel patient-view CDS');
}

const ledger = JSON.parse(readFileSync(join(root, 'docs/quality/strengthen-ledger.json'), 'utf8'));
const mf = ledger.phases?.find((m) => m.id === 'MF-CU-02');
if (!mf || mf.state !== 'DONE') {
  errors.push('strengthen-ledger.json: MF-CU-02 debe estar DONE');
}

for (const suite of [
  'packages/clinical-domain/src/cdsHooks/mapClinicalAlertsToPatientViewCards.test.ts',
  'apps/web/src/components/cds/ClinicalPatientViewCdsPanel.test.tsx',
]) {
  if (suite.includes('ClinicalPatientViewCdsPanel')) {
    const build = spawnSync('npm', ['run', 'build', '-w', '@epis2/clinical-domain'], {
      cwd: root,
      shell: true,
      encoding: 'utf8',
    });
    if (build.status !== 0) errors.push('build @epis2/clinical-domain falló');
  }
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

console.log('quality:cds-hooks-gate — OK (MF-CU-02 patient-view)');
