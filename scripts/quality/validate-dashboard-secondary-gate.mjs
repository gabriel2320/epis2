#!/usr/bin/env node
/** MF-FF-04 — dashboard secundario en nav (no compite con censo/ficha). */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const treePath = join(root, 'apps/web/src/navigation/epis2NavigationTree.ts');
const densityPath = join(root, 'apps/web/src/quality/uiDensityRules.ts');

for (const rel of [
  'apps/web/src/navigation/epis2NavigationTree.ts',
  'apps/web/src/quality/uiDensityRules.ts',
  'reports/archive/2026-06/epis2-mf-ff-04-dashboard-secondary.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const tree = readFileSync(treePath, 'utf8');
if (!tree.includes('navigationTier')) errors.push('epis2NavigationTree sin navigationTier');
if (!tree.includes('EPIS2_CLINICAL_HOME_ROUTE')) {
  errors.push('epis2NavigationTree sin EPIS2_CLINICAL_HOME_ROUTE');
}
if (!tree.includes("navigationTier: 'primary'")) {
  errors.push('epis2NavigationTree sin home primary');
}
if (!tree.includes("navigationTier: 'secondary'")) {
  errors.push('epis2NavigationTree sin dashboard secondary');
}

const density = readFileSync(densityPath, 'utf8');
if (!density.includes('EPIS_NAV_TIER_BY_ROUTE_PREFIX')) {
  errors.push('uiDensityRules sin EPIS_NAV_TIER_BY_ROUTE_PREFIX');
}
if (!density.includes('clinicalCensusHome')) {
  errors.push('uiDensityRules sin clinicalCensusHome registry');
}
if (!density.includes('isSecondaryClinicalRoute')) {
  errors.push('uiDensityRules sin isSecondaryClinicalRoute');
}

const ledger = JSON.parse(readFileSync(join(root, 'docs/quality/ficha-first-ledger.json'), 'utf8'));
const ff04 = ledger.phases?.find((p) => p.id === 'MF-FF-04');
if (!ff04 || ff04.state !== 'DONE') {
  errors.push('ficha-first-ledger: MF-FF-04 debe estar DONE');
}

const testRun = spawnSync(
  'npx',
  ['vitest', 'run', 'apps/web/src/navigation/epis2NavigationTree.test.ts'],
  { cwd: root, shell: true, encoding: 'utf8', stdio: 'pipe' },
);
if (testRun.status !== 0) {
  errors.push('epis2NavigationTree.test.ts falló');
  if (testRun.stdout) process.stdout.write(testRun.stdout);
  if (testRun.stderr) process.stderr.write(testRun.stderr);
}

if (errors.length) {
  console.error('dashboard-secondary-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('dashboard-secondary-gate OK — MF-FF-04 dashboard secundario');
