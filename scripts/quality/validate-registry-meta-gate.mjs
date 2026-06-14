#!/usr/bin/env node
/** MF-SH-04 / MF-REGISTRY-META — variableKey Chile (SNRE/RUT) + blueprints clave. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'packages/clinical-forms/src/types.ts',
  'packages/clinical-forms/src/chile-registry-meta.ts',
  'packages/clinical-domain/src/chile/registry-meta-allowlist.ts',
  'packages/clinical-forms/src/paper-mirror/variable-keys.ts',
  'packages/fhir-export/src/mappers.ts',
  'database/migrations/036_chile_patient_coverage.sql',
  'database/migrations/037_chile_patient_clinical_summary.sql',
  'database/migrations/038_chile_episodes_of_care.sql',
  'database/migrations/039_chile_professionals.sql',
  'database/migrations/040_chile_audit_extend.sql',
  'apps/api/src/clinical/patientClinicalSummary.ts',
  'packages/contracts/src/clinicalSummary.ts',
  'reports/epis2-mf-sh-04-registry-meta.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta: ${rel}`);
}

const typesSrc = readFileSync(join(root, 'packages/clinical-forms/src/types.ts'), 'utf8');
for (const token of ['variableKey?:', 'fhirPath?:', 'auditLevel?:', 'printMapping?:']) {
  if (!typesSrc.includes(token)) errors.push(`types.ts sin ${token}`);
}

const allowlistSrc = readFileSync(
  join(root, 'packages/clinical-domain/src/chile/registry-meta-allowlist.ts'),
  'utf8',
);
for (const key of ['rx.medication', 'patient.rut', 'summary.active_problems']) {
  if (!allowlistSrc.includes(`'${key}'`)) errors.push(`allowlist CHILE sin ${key}`);
}

const searchSrc = readFileSync(
  join(root, 'packages/clinical-forms/src/blueprints/patient-search.ts'),
  'utf8',
);
if (!searchSrc.includes("variableKey: 'patient.rut'")) {
  errors.push('patient-search sin variableKey patient.rut');
}

const summarySrc = readFileSync(
  join(root, 'packages/clinical-forms/src/blueprints/patient-summary.ts'),
  'utf8',
);
for (const key of ['summary.active_problems', 'summary.clinical_alerts']) {
  if (!summarySrc.includes(`variableKey: '${key}'`)) {
    errors.push(`patient-summary sin variableKey ${key}`);
  }
}

const rxSrc = readFileSync(
  join(root, 'packages/clinical-forms/src/blueprints/prescription.ts'),
  'utf8',
);
for (const key of ['rx.medication', 'rx.dose', 'rx.patient_instructions']) {
  if (!rxSrc.includes(`variableKey: '${key}'`)) {
    errors.push(`prescription sin variableKey ${key}`);
  }
}

const mirrorSrc = readFileSync(
  join(root, 'packages/clinical-forms/src/paper-mirror/variable-keys.ts'),
  'utf8',
);
for (const key of ['summary.active_problems', 'rx.medication']) {
  if (!mirrorSrc.includes(`'${key}'`)) errors.push(`paper-mirror sin ${key}`);
}

const routesSrc = readFileSync(join(root, 'apps/api/src/clinical/routes.ts'), 'utf8');
if (!routesSrc.includes('/clinical-summary')) {
  errors.push('routes.ts sin GET /clinical-summary');
}

const fhirSrc = readFileSync(join(root, 'packages/fhir-export/src/mappers.ts'), 'utf8');
if (!fhirSrc.includes('toFhirMedicationRequest')) {
  errors.push('falta toFhirMedicationRequest (MF-CHILE-RX-01)');
}

function run(label, cmd, args) {
  const result = spawnSync(cmd, args, { cwd: root, shell: true, stdio: 'inherit' });
  if (result.status !== 0) errors.push(`${label} falló`);
}

run('build clinical-domain', 'npm', ['run', 'build', '-w', '@epis2/clinical-domain']);

function runVitest(label, paths) {
  const result = spawnSync('npx', ['vitest', 'run', ...paths], {
    cwd: root,
    shell: true,
    stdio: 'inherit',
  });
  if (result.status !== 0) errors.push(`${label} falló`);
}

runVitest('registry-meta tests', [
  'packages/clinical-domain/src/chile/registry-meta-allowlist.test.ts',
  'packages/clinical-forms/src/chile-registry-meta.test.ts',
]);

if (errors.length) {
  console.error('registry-meta-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('registry-meta-gate OK — CHILE allowlist SNRE/RUT + blueprints clave');
