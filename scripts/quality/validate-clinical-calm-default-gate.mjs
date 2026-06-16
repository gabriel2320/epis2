#!/usr/bin/env node
/** MF-AEST-04 — clinical-calm como acento/tema default + shell ficha clásica. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const registry = readFileSync(
  join(root, 'packages/epis2-ui/src/theme/material-theme-registry.ts'),
  'utf8',
);
if (!registry.includes("DEFAULT_THEME_ID: Epis2ApprovedThemeId = 'clinical-calm'")) {
  errors.push('DEFAULT_THEME_ID debe ser clinical-calm (MF-AEST-04)');
}
if (!registry.includes("DEFAULT_EPIS2_ACCENT: Epis2Accent = 'clinicalCalm'")) {
  errors.push('DEFAULT_EPIS2_ACCENT debe ser clinicalCalm');
}

const createTheme = readFileSync(
  join(root, 'packages/epis2-ui/src/theme/create-epis2-theme.ts'),
  'utf8',
);
if (!createTheme.includes('DEFAULT_EPIS2_ACCENT')) {
  errors.push('createEpis2Theme debe usar DEFAULT_EPIS2_ACCENT');
}

const prefs = readFileSync(
  join(root, 'packages/epis2-ui/src/providers/EpisThemePreferences.tsx'),
  'utf8',
);
if (!prefs.includes('DEFAULT_EPIS2_ACCENT')) {
  errors.push('EpisThemePreferences debe usar DEFAULT_EPIS2_ACCENT');
}

const chartColors = readFileSync(
  join(root, 'packages/epis2-ui/src/theme/clinical/chart-modes-colors.ts'),
  'utf8',
);
if (!chartColors.includes('epis2ClinicalCalmCanvasColors.light')) {
  errors.push('chart-modes-colors shellBg debe usar canvas clinical-calm');
}

const summaryGrid = readFileSync(
  join(root, 'apps/web/src/components/clinical-summary/PatientClinicalSummaryGrid.tsx'),
  'utf8',
);
if (!summaryGrid.includes("surfaceProfile = 'calm'")) {
  errors.push('PatientClinicalSummaryGrid default surfaceProfile debe ser calm');
}

const traditional = readFileSync(
  join(root, 'apps/web/src/components/chart/TraditionalEhrMode.tsx'),
  'utf8',
);
if (!traditional.includes('surfaceProfile="calm"')) {
  errors.push('TraditionalEhrMode debe pasar surfaceProfile="calm" en resumen CICA');
}

const paper = readFileSync(
  join(root, 'apps/web/src/pages/StandalonePaperChartPage.tsx'),
  'utf8',
);
if (!paper.includes('epis2PaperCalmCanvasSx')) {
  errors.push('StandalonePaperChartPage debe usar epis2PaperCalmCanvasSx');
}

const program = join(root, 'docs/product/EPIS2_AESTHETIC_RESET_PROGRAM.md');
try {
  const doc = readFileSync(program, 'utf8');
  if (!doc.includes('MF-AEST-04') || !doc.includes('clinical-calm')) {
    errors.push('EPIS2_AESTHETIC_RESET_PROGRAM.md sin MF-AEST-04 documentado');
  }
} catch {
  errors.push('Falta docs/product/EPIS2_AESTHETIC_RESET_PROGRAM.md');
}

if (errors.length) {
  console.error(
    'clinical-calm-default-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('clinical-calm-default-gate OK — MF-AEST-04 clinical-calm default');
