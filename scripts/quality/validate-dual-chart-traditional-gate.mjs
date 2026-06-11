#!/usr/bin/env node
/** MF-DUAL-CHART-01 — Paridad visual ficha electrónica tradicional. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const chartModeSearch = join(root, 'apps/web/src/routes/chartModeSearch.ts');
if (!existsSync(chartModeSearch)) {
  errors.push('Falta apps/web/src/routes/chartModeSearch.ts con parseChartModeSearch()');
} else {
  const src = readFileSync(chartModeSearch, 'utf8');
  for (const token of ['parseChartModeSearch', 'chartMode', 'traditional', 'paper']) {
    if (!src.includes(token)) errors.push(`chartModeSearch.ts sin ${token}`);
  }
}

const traditional = readFileSync(
  join(root, 'apps/web/src/components/chart/TraditionalEhrMode.tsx'),
  'utf8',
);
if (!traditional.includes('PatientClinicalSummaryGrid')) {
  errors.push(
    'TraditionalEhrMode.tsx debe integrar PatientClinicalSummaryGrid (Figma Medical Record)',
  );
}
if (!traditional.includes('epis2-traditional-ehr-nav')) {
  errors.push('TraditionalEhrMode.tsx sin nav lateral testId');
}

const workspace = join(root, 'apps/web/src/pages/PatientWorkspacePage.tsx');
if (existsSync(workspace)) {
  const ws = readFileSync(workspace, 'utf8');
  if (!ws.includes('ClinicalShell') && !ws.includes('DualChartPatientPage')) {
    errors.push(
      'PatientWorkspacePage.tsx debe usar ClinicalShell o DualChartPatientPage detrás de flag',
    );
  }
}

const espacioLayout = [
  'apps/web/src/layouts/EpisAppScaffold.tsx',
  'apps/web/src/layouts/ClinicalShellLayout.tsx',
];
const hasCommandOnEspacio = espacioLayout.some((rel) => {
  const path = join(root, rel);
  if (!existsSync(path)) return false;
  const src = readFileSync(path, 'utf8');
  return src.includes('EpisUniversalCommandBar') || src.includes('ClinicalShell');
});
if (!hasCommandOnEspacio) {
  errors.push('Layouts /espacio/* deben montar command bar transversal (ClinicalShell o dock)');
}

const e2e = join(root, 'e2e/dual-chart-modes.spec.ts');
if (existsSync(e2e)) {
  const src = readFileSync(e2e, 'utf8');
  if (!src.includes('/espacio/ficha') && !src.includes('/dev/chart-modes')) {
    errors.push('dual-chart-modes.spec.ts debe cubrir preview o /espacio/ficha');
  }
}

if (errors.length) {
  console.error('dual-chart-traditional-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('dual-chart-traditional-gate OK — MF-DUAL-CHART-01 paridad traditional');
