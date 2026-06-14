#!/usr/bin/env node
/** MF-DI-05 / MF-DI-06 — acciones probables + chips silenciosos en ficha. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'packages/command-registry/src/probableActions.ts',
  'packages/command-registry/src/probableActions.test.ts',
  'packages/clinical-domain/src/silentSuggestions/buildSilentSuggestions.ts',
  'packages/clinical-domain/src/silentSuggestions/buildSilentSuggestions.test.ts',
  'apps/web/src/components/chart/ClinicalProbableActionsPanel.tsx',
  'apps/web/src/components/chart/ClinicalProbableActionsPanel.test.tsx',
  'apps/web/src/components/cds/ClinicalCdsCard.tsx',
  'apps/web/src/components/cds/ClinicalSilentSuggestionsPanel.tsx',
  'apps/web/src/components/cds/ClinicalSilentSuggestionsPanel.test.tsx',
  'apps/web/src/clinical/useSilentClinicalSuggestions.ts',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const grid = readFileSync(
  join(root, 'apps/web/src/components/clinical-summary/PatientClinicalSummaryGrid.tsx'),
  'utf8',
);
if (!grid.includes('ClinicalProbableActionsPanel')) {
  errors.push('PatientClinicalSummaryGrid debe integrar ClinicalProbableActionsPanel');
}

const contextPane = readFileSync(
  join(root, 'apps/web/src/components/EpisClinicalContextPane.tsx'),
  'utf8',
);
if (!contextPane.includes('ClinicalSilentSuggestionsPanel')) {
  errors.push('EpisClinicalContextPane debe integrar ClinicalSilentSuggestionsPanel');
}

const dual = readFileSync(join(root, 'apps/web/src/pages/DualChartPatientPage.tsx'), 'utf8');
if (!dual.includes('getProbablePatientActionChips')) {
  errors.push('DualChartPatientPage debe calcular acciones probables');
}
if (!dual.includes('clinicalAlerts={clinicalAlerts}')) {
  errors.push('DualChartPatientPage debe pasar alertas al panel de contexto');
}

const e2e = readFileSync(join(root, 'e2e/dual-chart-modes.spec.ts'), 'utf8');
if (!e2e.includes('epis2-clinical-probable-actions')) {
  errors.push('E2E dual-chart debe verificar panel acciones probables');
}
if (!e2e.includes('epis2-clinical-silent-suggestions')) {
  errors.push('E2E dual-chart debe verificar chips silenciosos');
}

for (const suite of [
  'packages/command-registry/src/probableActions.test.ts',
  'packages/clinical-domain/src/silentSuggestions/buildSilentSuggestions.test.ts',
  'apps/web/src/components/chart/ClinicalProbableActionsPanel.test.tsx',
  'apps/web/src/components/cds/ClinicalSilentSuggestionsPanel.test.tsx',
]) {
  const run = spawnSync('npx', ['vitest', 'run', '--run', suite], {
    cwd: root,
    shell: true,
    encoding: 'utf8',
  });
  if (run.status !== 0) errors.push(`${suite} falló`);
}

if (errors.length) {
  console.error('quality:di-suggestions-gate — FALLO');
  for (const e of errors) console.error(`  · ${e}`);
  process.exit(1);
}

console.log('quality:di-suggestions-gate — OK (MF-DI-05 + MF-DI-06)');
