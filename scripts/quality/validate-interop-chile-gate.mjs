#!/usr/bin/env node
/** MF-IC-01 / MF-IC-02 — Interop Chile: export MINSAL + SNRE staging (read-only ledger check). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const evidence = [
  'reports/archive/2026-06/epis2-mf-ic-01-minsal-export.md',
  'reports/archive/2026-06/epis2-mf-ic-02-snre-staging.md',
  'reports/archive/2026-06/epis2-mf-ic-03-questionnaire.md',
];

const requiredSources = [
  'packages/fhir-export/src/constants.ts',
  'packages/fhir-export/src/chileInteropMeta.ts',
  'packages/fhir-export/src/minsalExport.ts',
  'packages/fhir-export/src/snreStaging.ts',
  'packages/fhir-export/src/questionnaireExport.ts',
  'packages/fhir-export/src/minsalExport.test.ts',
  'packages/fhir-export/src/snreStaging.test.ts',
  'packages/fhir-export/src/questionnaireExport.test.ts',
  'packages/clinical-domain/src/chile/minsalProfiles.ts',
];

for (const rel of [...evidence, ...requiredSources]) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const constants = readFileSync(join(root, 'packages/fhir-export/src/constants.ts'), 'utf8');
if (!constants.includes('EPIS2_CL_FHIR_BASE')) {
  errors.push('constants.ts debe definir EPIS2_CL_FHIR_BASE');
}

const snreStaging = readFileSync(join(root, 'packages/fhir-export/src/snreStaging.ts'), 'utf8');
if (!snreStaging.includes('EPIS2_CL_FHIR_BASE')) {
  errors.push('snreStaging.ts debe usar EPIS2_CL_FHIR_BASE');
}
if (snreStaging.includes("'http://epis2.cl/fhir'")) {
  errors.push('snreStaging.ts no debe duplicar literal http://epis2.cl/fhir');
}

const minsalExport = readFileSync(join(root, 'packages/fhir-export/src/minsalExport.ts'), 'utf8');
if (!minsalExport.includes('MINSAL_PROFILES')) {
  errors.push('minsalExport.ts debe importar MINSAL_PROFILES desde @epis2/clinical-domain');
}
if (minsalExport.includes('EPIS2_MINSAL_FHIR_BASE')) {
  errors.push('minsalExport.ts no debe importar EPIS2_MINSAL_FHIR_BASE (usar EPIS2_CL_FHIR_BASE)');
}

const ledger = JSON.parse(readFileSync(join(root, 'docs/quality/strengthen-ledger.json'), 'utf8'));
for (const id of ['MF-IC-01', 'MF-IC-02', 'MF-IC-03']) {
  const mf = ledger.phases?.find((m) => m.id === id);
  if (!mf || mf.state !== 'DONE') {
    errors.push(`strengthen-ledger.json: ${id} debe estar DONE`);
  }
  const report = mf?.closureReport;
  if (report && !existsSync(join(root, report))) {
    errors.push(`closureReport ledger ${id} inexistente: ${report}`);
  }
}

const build = spawnSync('npm', ['run', 'build', '-w', '@epis2/fhir-export'], {
  cwd: root,
  shell: true,
  encoding: 'utf8',
});
if (build.status !== 0) errors.push('build @epis2/fhir-export falló');

const testRun = spawnSync('npm', ['run', 'test', '--', 'packages/fhir-export'], {
  cwd: root,
  shell: true,
  encoding: 'utf8',
  stdio: 'pipe',
});
if (testRun.status !== 0) {
  errors.push('npm run test -- packages/fhir-export falló');
  if (testRun.stdout) process.stdout.write(testRun.stdout);
  if (testRun.stderr) process.stderr.write(testRun.stderr);
}

if (errors.length) {
  console.error('quality:interop-chile-gate — FALLO');
  for (const e of errors) console.error(`  · ${e}`);
  process.exit(1);
}

console.log(
  'quality:interop-chile-gate — OK (MF-IC-01 MINSAL + MF-IC-02 SNRE + MF-IC-03 Questionnaire)',
);
