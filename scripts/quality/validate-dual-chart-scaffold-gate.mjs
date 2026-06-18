#!/usr/bin/env node
/** MF-DUAL-CHART-00 — Scaffold ADR-002 + componentes chart + preview dev. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const requiredDocs = [
  'docs/adr/ADR-002-dual-chart-modes.md',
  'docs/architecture/EPIS2_DUAL_CHART_ROUTE_MAP.md',
  'docs/architecture/EPIS2_DUAL_CHART_MIGRATION.md',
  'docs/product/EPIS2_DUAL_CHART_DEV_PLAN.md',
  'docs/quality/dual-chart-ledger.json',
];

for (const rel of requiredDocs) {
  if (!existsSync(join(root, rel))) errors.push(`Falta doc: ${rel}`);
}

const requiredFiles = [
  'apps/web/src/components/chart/ClinicalShell.tsx',
  'apps/web/src/components/chart/TraditionalEhrMode.tsx',
  'apps/web/src/components/chart/PaperChartMode.tsx',
  'apps/web/src/components/chart/PatientIdentityBand.tsx',
  'apps/web/src/components/chart/ChartModeSwitch.tsx',
  'apps/web/src/components/chart/CommandPaletteOverlay.tsx',
  'apps/web/src/components/chart/paper/PaperChartTemplate.tsx',
  'apps/web/src/components/chart/paper/paperChartSections.ts',
  'apps/web/src/components/chart/paper/paperChartPrint.css',
  'apps/web/src/dev/dualChartModesEnv.ts',
  'apps/web/src/pages/dev/DualChartModesPreviewPage.tsx',
  'packages/epis2-ui/src/theme/chart-modes-tokens.ts',
  'packages/epis2-ui/src/stories/ChartModesPreview.stories.tsx',
  'e2e/dual-chart-modes.spec.ts',
];

for (const rel of requiredFiles) {
  if (!existsSync(join(root, rel))) errors.push(`Falta archivo: ${rel}`);
}

const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
if (!router.includes('/dev/chart-modes')) {
  errors.push('router.tsx sin ruta /dev/chart-modes');
}
if (!router.includes('DualChartModesPreviewPage')) {
  errors.push('router.tsx sin DualChartModesPreviewPage');
}

const envExample = readFileSync(join(root, '.env.example'), 'utf8');
if (!envExample.includes('VITE_ENABLE_DUAL_CHART_MODES')) {
  errors.push('.env.example sin VITE_ENABLE_DUAL_CHART_MODES');
}

const copy = readFileSync(join(root, 'packages/design-system/src/copy/es.ts'), 'utf8');
if (!copy.includes('chartModes:')) {
  errors.push('copy/es.ts sin sección chartModes');
}

const webSections = readFileSync(
  join(root, 'apps/web/src/components/chart/paper/paperChartSections.ts'),
  'utf8',
);
const schemaSections = readFileSync(
  join(root, 'packages/clinical-forms/src/paper-chart/schema.ts'),
  'utf8',
);
if (
  !webSections.includes('@epis2/clinical-forms') ||
  !webSections.includes('PAPER_CHART_SECTION_IDS')
) {
  errors.push(
    'paperChartSections.ts debe re-exportar PAPER_CHART_SECTION_IDS desde @epis2/clinical-forms',
  );
}
const sectionIds = [
  'cover',
  'anamnesis',
  'physicalExam',
  'orders',
  'soap',
  'labs',
  'discharge',
  'nursing',
  'fluidBalance',
  'consults',
  'procedures',
  'imaging',
  'consent',
  'socialWork',
];
for (const id of sectionIds) {
  if (!schemaSections.includes(`'${id}'`)) {
    errors.push(`clinical-forms paper-chart/schema.ts sin sección ${id}`);
  }
}

const printCss = readFileSync(
  join(root, 'apps/web/src/components/chart/paper/paperChartPrint.css'),
  'utf8',
);
if (!printCss.includes('@page letter')) errors.push('paperChartPrint.css sin @page letter');
if (!printCss.includes('@page a5')) errors.push('paperChartPrint.css sin @page a5');
if (
  printCss.includes('@page a4') ||
  printCss.includes('size: a4') ||
  printCss.includes('210mm 297mm')
) {
  errors.push('paperChartPrint.css no debe usar A4');
}

const shell = readFileSync(join(root, 'apps/web/src/components/chart/ClinicalShell.tsx'), 'utf8');
for (const token of ['EpisUniversalCommandBar', 'CommandPaletteOverlay', 'ChartModeSwitch']) {
  if (!shell.includes(token)) errors.push(`ClinicalShell.tsx sin ${token}`);
}

const tokens = readFileSync(
  join(root, 'packages/epis2-ui/src/theme/chart-modes-tokens.ts'),
  'utf8',
);
for (const token of ['epis2TraditionalChartTokens', 'epis2PaperChartTokens']) {
  if (!tokens.includes(token)) errors.push(`chart-modes-tokens.ts sin ${token}`);
}

const themeBarrel = readFileSync(join(root, 'packages/epis2-ui/src/theme/theme.ts'), 'utf8');
if (!themeBarrel.includes('chart-modes-tokens')) {
  errors.push('epis2-ui theme/theme.ts no exporta chart-modes-tokens');
}

if (errors.length) {
  console.error('dual-chart-scaffold-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('dual-chart-scaffold-gate OK — MF-DUAL-CHART-00 scaffold verificado');
