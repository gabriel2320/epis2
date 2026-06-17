#!/usr/bin/env node
/** MF-AEST-05 / CICA Ley 5 — breadcrumb y retorno seguro. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'apps/web/src/components/layout/clinical/ClinicalIntentBreadcrumb.tsx',
  'apps/web/src/clinical/clinicalIntent.ts',
]) {
  try {
    readFileSync(join(root, rel), 'utf8');
  } catch {
    errors.push(`Falta ${rel}`);
  }
}

const formPage = readFileSync(
  join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'),
  'utf8',
);
if (!formPage.includes('ClinicalPageNav')) {
  errors.push('GeneratedClinicalFormPage sin ClinicalPageNav (CICA Ley 5)');
}
if (!formPage.includes('resolveIntentFromBlueprint')) {
  errors.push('GeneratedClinicalFormPage debe resolver intención CICA');
}

const pageNav = readFileSync(join(root, 'apps/web/src/components/ClinicalPageNav.tsx'), 'utf8');
if (!pageNav.includes('ClinicalIntentBreadcrumb')) {
  errors.push('ClinicalPageNav debe usar ClinicalIntentBreadcrumb');
}
if (!pageNav.includes('clinical-nav-back-to-census')) {
  errors.push('ClinicalPageNav sin retorno al censo');
}
if (pageNav.includes("to: '/comando'") || pageNav.includes('to="/comando"')) {
  errors.push('ClinicalPageNav no debe enlazar /comando — usar censo CICA');
}

const paper = readFileSync(join(root, 'apps/web/src/pages/StandalonePaperChartPage.tsx'), 'utf8');
if (!paper.includes('ClinicalPageNav') && !paper.includes('ClinicalIntentBreadcrumb')) {
  errors.push('StandalonePaperChartPage debe usar ClinicalPageNav o ClinicalIntentBreadcrumb');
}

const copy = readFileSync(join(root, 'packages/design-system/src/copy/es.ts'), 'utf8');
if (!copy.includes('clinicalBreadcrumb')) {
  errors.push('copy/es.ts sin clinicalBreadcrumb');
}

const cica = join(root, 'docs/design/EPIS2_CICA.md');
try {
  readFileSync(cica, 'utf8');
} catch {
  errors.push('Falta docs/design/EPIS2_CICA.md');
}

if (errors.length) {
  console.error(
    'clinical-navigation-clarity-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('clinical-navigation-clarity-gate OK — CICA Ley 5 breadcrumb + retorno');
