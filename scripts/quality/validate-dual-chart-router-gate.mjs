#!/usr/bin/env node
/** MF-DUAL-CHART-03 — Router switch chartMode en /espacio/ficha. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const dualPage = join(root, 'apps/web/src/pages/DualChartPatientPage.tsx');
if (!existsSync(dualPage)) {
  errors.push('Falta apps/web/src/pages/DualChartPatientPage.tsx');
}

const workspace = readFileSync(join(root, 'apps/web/src/pages/PatientWorkspacePage.tsx'), 'utf8');
if (!workspace.includes('isDualChartModesEnabled') && !workspace.includes('DualChartPatientPage')) {
  errors.push(
    'PatientWorkspacePage.tsx debe ramificar a DualChartPatientPage con isDualChartModesEnabled()',
  );
}
if (!workspace.includes('chartMode')) {
  errors.push('PatientWorkspacePage.tsx debe leer chartMode del search');
}

const chartSearch = join(root, 'apps/web/src/routes/chartModeSearch.ts');
if (!existsSync(chartSearch)) {
  errors.push('Falta chartModeSearch.ts');
} else {
  const src = readFileSync(chartSearch, 'utf8');
  if (!src.includes('default') && !src.includes("'traditional'")) {
    errors.push('parseChartModeSearch debe default traditional');
  }
}

if (!existsSync(join(root, 'e2e/three-modes-journey.spec.ts'))) {
  errors.push('Falta e2e/three-modes-journey.spec.ts — no eliminar legacy journey');
}

const e2eDual = join(root, 'e2e/dual-chart-modes.spec.ts');
if (existsSync(e2eDual)) {
  const src = readFileSync(e2eDual, 'utf8');
  if (!src.includes('/espacio/ficha')) {
    errors.push('dual-chart-modes.spec.ts debe incluir journey /espacio/ficha (fase 3)');
  }
}

if (errors.length) {
  console.error('dual-chart-router-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('dual-chart-router-gate OK — MF-DUAL-CHART-03 router switch');
