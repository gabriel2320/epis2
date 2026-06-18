#!/usr/bin/env node
/** MF-AEST-02 — ficha clásica tabulada (no rail de 17 ítems como entrada principal). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'apps/web/src/components/chart/ClassicChartTabs.tsx',
  'apps/web/src/components/chart/classicChartTabConfig.ts',
]) {
  try {
    readFileSync(join(root, rel), 'utf8');
  } catch {
    errors.push(`Falta ${rel}`);
  }
}

const traditional = readFileSync(
  join(root, 'apps/web/src/components/chart/TraditionalEhrMode.tsx'),
  'utf8',
);
if (!traditional.includes('ClassicChartTabs')) {
  errors.push('TraditionalEhrMode debe usar ClassicChartTabs');
}
if (!traditional.includes('classic-chart-tabs')) {
  errors.push('TraditionalEhrMode sin testId classic-chart-tabs');
}
if (/<TraditionalSectionNav[\s/>]/.test(traditional)) {
  errors.push('TraditionalEhrMode no debe usar rail lateral TraditionalSectionNav (MF-AEST-02)');
}

const copy = readFileSync(join(root, 'packages/design-system/src/copy/es.ts'), 'utf8');
if (!copy.includes('classicTabs')) {
  errors.push('copy/es.ts sin chartModes.classicTabs');
}
if (!copy.includes("more: 'Más'")) {
  errors.push('copy/es.ts sin chartModes.classicTabs.more (MF-AEST-02b)');
}

const config = readFileSync(
  join(root, 'apps/web/src/components/chart/classicChartTabConfig.ts'),
  'utf8',
);
if (!traditional.includes('ClassicChartSummaryPanel')) {
  errors.push('TraditionalEhrMode debe usar ClassicChartSummaryPanel (FASE 3 resumen 5 bloques)');
}

const dualChart = readFileSync(join(root, 'apps/web/src/pages/DualChartPatientPage.tsx'), 'utf8');
if (
  !dualChart.includes('composition="cica-minimal"') &&
  !dualChart.includes("composition='cica-minimal'")
) {
  errors.push('DualChartPatientPage debe usar ClinicalShell composition cica-minimal');
}
if (!dualChart.includes('cicaLayout')) {
  errors.push('DualChartPatientPage debe activar cicaLayout en TraditionalEhrMode');
}
if (
  !dualChart.includes('PatientIdentityBand') &&
  !dualChart.includes('ClinicalContextDenseStrip')
) {
  errors.push('DualChartPatientPage debe exponer contexto clínico denso bajo identidad');
}

const summaryPanel = readFileSync(
  join(root, 'apps/web/src/components/chart/ClassicChartSummaryPanel.tsx'),
  'utf8',
);
if (!summaryPanel.includes('data-cica-summary-blocks')) {
  errors.push('ClassicChartSummaryPanel sin presupuesto 5 bloques CICA');
}

if (!config.includes("'more'")) {
  errors.push('classicChartTabConfig sin tab Más (MF-AEST-02b)');
}

if (errors.length) {
  console.error(
    'classic-chart-composition-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('classic-chart-composition-gate OK — MF-AEST-02 tabs clínicos');
