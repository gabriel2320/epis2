#!/usr/bin/env node
/** MF-AEST-01 — densidad de acciones: una primaria visible por pantalla demo. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const rules = readFileSync(join(root, 'apps/web/src/quality/uiDensityRules.ts'), 'utf8');
for (const token of [
  'EPIS_MAX_VISIBLE_PRIMARY_ACTIONS',
  'EPIS_MAX_VISIBLE_SECONDARY_ACTIONS',
  'EPIS_MAX_VISIBLE_TOTAL_ACTIONS',
]) {
  if (!rules.includes(token)) {
    errors.push(`uiDensityRules.ts sin ${token}`);
  }
}

const primaryBar = readFileSync(
  join(root, 'packages/epis2-ui/src/forms/EpisPrimaryActionBar.tsx'),
  'utf8',
);
if (!primaryBar.includes('EpisPrimaryActionBar')) {
  errors.push('Falta EpisPrimaryActionBar en epis2-ui');
}

const chartActionBar = readFileSync(
  join(root, 'apps/web/src/components/chart/ClinicalActionBar.tsx'),
  'utf8',
);
if (!chartActionBar.includes('EpisPrimaryActionBar')) {
  errors.push('ClinicalActionBar debe usar EpisPrimaryActionBar');
}
if (chartActionBar.includes('epis2-chart-action-save-mobile')) {
  errors.push('ClinicalActionBar no debe duplicar fila mobile de botones');
}
if (chartActionBar.includes('epis2-chart-action-print-mobile')) {
  errors.push('ClinicalActionBar no debe duplicar botones print mobile');
}

const formActionBar = readFileSync(
  join(root, 'packages/epis2-ui/src/forms/EpisClinicalFormActionBar.tsx'),
  'utf8',
);
if (!formActionBar.includes('EpisPrimaryActionBar')) {
  errors.push('EpisClinicalFormActionBar debe delegar en EpisPrimaryActionBar');
}

const formPage = readFileSync(
  join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'),
  'utf8',
);
if (!formPage.includes('ClinicalLayoutActionBar')) {
  errors.push('GeneratedClinicalFormPage sin ClinicalLayoutActionBar');
}

if (errors.length) {
  console.error(
    'aesthetic-action-density-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('aesthetic-action-density-gate OK — MF-AEST-01 acción primaria única');
