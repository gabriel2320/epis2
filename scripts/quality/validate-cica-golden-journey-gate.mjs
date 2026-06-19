#!/usr/bin/env node
/** MF-CICA-GOLDEN-01 — golden journey /app/* documentado + contratos. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const spec = join(root, 'e2e/golden-cica-journey.spec.ts');
const closeReport = join(root, 'reports/epis2-mf-cica-golden-journey-close.md');
const searchPage = join(root, 'apps/web/src/cica/CicaPatientSearchPage.tsx');
const evolutionPage = join(root, 'apps/web/src/cica/CicaNewEvolutionPage.tsx');
const webPkg = join(root, 'apps/web/package.json');

if (!existsSync(spec)) errors.push('falta e2e/golden-cica-journey.spec.ts');
if (!existsSync(closeReport)) errors.push('falta reports/epis2-mf-cica-golden-journey-close.md');

const searchSrc = readFileSync(searchPage, 'utf8');
if (!searchSrc.includes('cica-patient-search-hero')) {
  errors.push('CicaPatientSearchPage sin testId cica-patient-search-hero');
}

const evoSrc = readFileSync(evolutionPage, 'utf8');
if (!evoSrc.includes('epis2-form-sign')) {
  errors.push('CicaNewEvolutionPage sin acción epis2-form-sign');
}

const pkg = JSON.parse(readFileSync(webPkg, 'utf8'));
if (!pkg.scripts?.['test:e2e:golden-cica']) {
  errors.push('apps/web sin script test:e2e:golden-cica');
}

const cicaEnv = readFileSync(join(root, 'apps/web/src/dev/cicaUiEnv.ts'), 'utf8');
if (!cicaEnv.includes("CICA_UI_PRODUCT_STATUS: CicaUiProductStatus = 'go'")) {
  errors.push('CICA debe estar GO para golden /app');
}

if (errors.length === 0) {
  const vitest = spawnSync('npx', ['vitest', 'run', 'tests/golden-clinical-journey.spec.ts'], {
    cwd: root,
    stdio: 'inherit',
    shell: true,
  });
  if (vitest.status !== 0) {
    errors.push('tests/golden-clinical-journey.spec.ts falló');
  }
}

if (errors.length) {
  console.error('cica-golden-journey-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('cica-golden-journey-gate OK — spec /app + golden vitest');
