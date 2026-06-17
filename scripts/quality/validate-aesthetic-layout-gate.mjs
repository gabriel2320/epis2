#!/usr/bin/env node
/** EPIS2 Clinical Layout Engine — gate de composición (MF-AEST layout). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const engineFiles = [
  'packages/epis2-ui/src/layout/clinical/clinicalLayoutTokens.ts',
  'packages/epis2-ui/src/layout/clinical/clinicalLayoutEngine.ts',
  'packages/epis2-ui/src/layout/clinical/ClinicalScreen.tsx',
  'packages/epis2-ui/src/layout/clinical/ClinicalLayoutActionBar.tsx',
  'packages/epis2-ui/src/layout/clinical/ClinicalFieldGrid.tsx',
  'packages/epis2-ui/src/layout/clinical/ClinicalSection.tsx',
];

for (const rel of engineFiles) {
  try {
    readFileSync(join(root, rel), 'utf8');
  } catch {
    errors.push(`Falta artefacto layout engine: ${rel}`);
  }
}

const engine = readFileSync(
  join(root, 'packages/epis2-ui/src/layout/clinical/clinicalLayoutEngine.ts'),
  'utf8',
);
if (!engine.includes('normalizeClinicalActions')) {
  errors.push('clinicalLayoutEngine sin normalizeClinicalActions');
}
if (!engine.includes('auditClinicalLayout')) {
  errors.push('clinicalLayoutEngine sin auditClinicalLayout');
}

const traditional = readFileSync(
  join(root, 'apps/web/src/components/chart/TraditionalEhrMode.tsx'),
  'utf8',
);
if (!traditional.includes('ClinicalScreen')) {
  errors.push('TraditionalEhrMode debe usar ClinicalScreen');
}
if (!traditional.includes('ClassicChartTabs')) {
  errors.push('TraditionalEhrMode debe usar ClassicChartTabs (MF-AEST-02)');
}

const formPage = readFileSync(
  join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'),
  'utf8',
);
if (!formPage.includes('ClinicalLayoutActionBar')) {
  errors.push('GeneratedClinicalFormPage debe usar ClinicalLayoutActionBar');
}

const paperPage = readFileSync(
  join(root, 'apps/web/src/pages/StandalonePaperChartPage.tsx'),
  'utf8',
);
if (!paperPage.includes('ClinicalScreen')) {
  errors.push('StandalonePaperChartPage debe usar ClinicalScreen');
}

const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
if (!router.includes('/espacio/ficha/papel')) {
  errors.push('Router sin ruta modo papel exclusivo');
}

const actionBar = readFileSync(
  join(root, 'packages/epis2-ui/src/layout/clinical/ClinicalLayoutActionBar.tsx'),
  'utf8',
);
if (!actionBar.includes('data-action-kind')) {
  errors.push('ClinicalLayoutActionBar sin data-action-kind');
}

const uiDensity = readFileSync(join(root, 'apps/web/src/quality/uiDensityRules.ts'), 'utf8');
if (!uiDensity.includes('EPIS_MAX_VISIBLE_PRIMARY_ACTIONS')) {
  errors.push('uiDensityRules sin presupuesto de acciones primarias');
}

const e2ePath = join(root, 'e2e/aesthetic-classic-mode.spec.ts');
try {
  readFileSync(e2ePath, 'utf8');
} catch {
  errors.push('Falta e2e/aesthetic-classic-mode.spec.ts');
}

if (errors.length) {
  console.error('aesthetic-layout-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('aesthetic-layout-gate OK — Clinical Layout Engine presente e integrado');
