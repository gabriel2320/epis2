#!/usr/bin/env node
/**
 * MF-CASE-09: gate catálogo clinical-case-intel (N SIM desde catalog.json).
 * Uso: npm run quality:case-intel-catalog-gate
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

import { readExpectedSimCatalogSize } from './lib/case-intel-expected.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
let EXPECTED;
try {
  EXPECTED = readExpectedSimCatalogSize();
} catch (err) {
  console.error(
    'case-intel-catalog-gate FAILED:\n  - ' + (err instanceof Error ? err.message : err),
  );
  process.exit(1);
}

const catalogPath = join(root, 'services/clinical-case-intel/fixtures/catalog.json');
const simCasesPath = join(root, 'packages/test-fixtures/src/simClinicalCases.ts');
const seedPath = join(root, 'database/migrations/042_sim_clinical_cases_seed.sql');

if (!existsSync(catalogPath)) {
  errors.push('falta fixtures/catalog.json');
} else {
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
  if (!Array.isArray(catalog.entries) || catalog.entries.length !== EXPECTED) {
    errors.push(`catalog.json debe tener ${EXPECTED} entries`);
  } else {
    const fixturesDir = join(root, 'services/clinical-case-intel/fixtures');
    for (const entry of catalog.entries) {
      const filePath = join(fixturesDir, entry.file);
      if (!existsSync(filePath)) {
        errors.push(`fixture ausente: ${entry.file}`);
      }
    }
  }
}

if (!existsSync(simCasesPath)) {
  errors.push('falta packages/test-fixtures/src/simClinicalCases.ts');
} else {
  const simTs = readFileSync(simCasesPath, 'utf8');
  const count = (simTs.match(/demoCaseCode: 'SIM-/g) ?? []).length;
  if (count !== EXPECTED) {
    errors.push(`simClinicalCases.ts debe tener ${EXPECTED} casos (actual: ${count})`);
  }
}

if (!existsSync(seedPath)) {
  errors.push('falta 042_sim_clinical_cases_seed.sql');
} else {
  const seed = readFileSync(seedPath, 'utf8');
  const patientRows = (seed.match(/'a0000002-/g) ?? []).length;
  if (patientRows < EXPECTED) {
    errors.push(`seed SQL debe incluir >=${EXPECTED} pacientes SIM (actual: ${patientRows})`);
  }
}

const remoteManifest = join(
  root,
  'services/clinical-case-intel/fixtures/meded-remote-sources.json',
);
if (!existsSync(remoteManifest)) {
  errors.push('falta meded-remote-sources.json (MF-CASE-07)');
}

function runVitest(pattern) {
  const isWin = process.platform === 'win32';
  const bin = isWin ? 'npx.cmd' : 'npx';
  return spawnSync(bin, ['vitest', 'run', pattern], {
    cwd: root,
    stdio: 'pipe',
    shell: isWin,
    encoding: 'utf8',
  });
}

const vitestTargets = [
  'services/clinical-case-intel/src/sources/catalog.test.ts',
  'services/clinical-case-intel/src/sources/mededRemote.test.ts',
  'packages/test-fixtures/src/simCases.test.ts',
];

for (const target of vitestTargets) {
  const result = runVitest(target);
  if (result.status !== 0) {
    errors.push(`vitest falló: ${target}`);
    if (result.stderr) errors.push(result.stderr.trim().slice(0, 400));
  }
}

if (errors.length) {
  console.error('case-intel-catalog-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`case-intel-catalog-gate OK — ${EXPECTED} casos SIM, fixtures y tests remotos`);
