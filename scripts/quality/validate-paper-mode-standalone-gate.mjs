#!/usr/bin/env node
/** MF-AEST-03 — modo papel en pantalla exclusiva con navegación diaria. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
if (!router.includes("path: '/espacio/ficha/papel'")) {
  errors.push('router sin ruta /espacio/ficha/papel');
}
if (!router.includes('StandalonePaperChartPage')) {
  errors.push('router sin StandalonePaperChartPage');
}

const dual = readFileSync(join(root, 'apps/web/src/pages/DualChartPatientPage.tsx'), 'utf8');
if (dual.includes('<PaperChartMode')) {
  errors.push('DualChartPatientPage no debe embeber PaperChartMode');
}
if (!dual.includes('PAPER_STANDALONE_ROUTE')) {
  errors.push('DualChartPatientPage debe redirigir a PAPER_STANDALONE_ROUTE');
}

const standalone = readFileSync(
  join(root, 'apps/web/src/pages/StandalonePaperChartPage.tsx'),
  'utf8',
);
for (const testId of ['epis2-paper-standalone-page']) {
  if (!standalone.includes(testId)) {
    errors.push(`StandalonePaperChartPage sin testId ${testId}`);
  }
}
if (!standalone.includes('ClinicalPageNav')) {
  errors.push('StandalonePaperChartPage debe montar ClinicalPageNav (CICA-L-10)');
}
if (!standalone.includes('ClinicalTransversalCommandDock')) {
  errors.push('StandalonePaperChartPage debe montar ClinicalTransversalCommandDock');
}

const dayNav = readFileSync(
  join(root, 'apps/web/src/components/chart/paper/PaperDayNavBar.tsx'),
  'utf8',
);
if (!dayNav.includes('PaperDayNavBar')) {
  errors.push('Falta PaperDayNavBar');
}

const registry = readFileSync(join(root, 'apps/web/src/quality/uiDensityRules.ts'), 'utf8');
if (!registry.includes('paperStandalone')) {
  errors.push('EPIS_SCREEN_REGISTRY sin paperStandalone');
}

if (errors.length) {
  console.error('paper-mode-standalone-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('paper-mode-standalone-gate OK — MF-AEST-03 pantalla papel exclusiva');
