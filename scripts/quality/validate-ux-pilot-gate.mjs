#!/usr/bin/env node
/**
 * UX pilot — evidencia estática del arco command-first (CE-0 → CE-5 + LAYOUT-G12).
 * Ejecutar: npm run quality:ux-pilot-gate
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const requiredFiles = [
  'packages/epis2-ui/src/command/EpisFloatingCommandDock.tsx',
  'packages/epis2-ui/src/forms/EpisClinicalFormActionBar.tsx',
  'packages/epis2-ui/src/clinical/EpisAuthScreen.tsx',
  'packages/epis2-ui/src/layout/EpisWorkspaceSection.tsx',
  'apps/web/src/pages/CommandCenterPage.tsx',
  'apps/web/src/pages/PatientWorkspacePage.tsx',
  'apps/web/src/pages/LoginPage.tsx',
  'apps/web/src/pages/SessionExpiredPage.tsx',
  'apps/web/src/pages/ResultsInboxPage.tsx',
  'apps/web/src/components/PatientLongitudinalPanel.tsx',
  'e2e/ux-g02-command-first.spec.ts',
  'e2e/login-gateway.spec.ts',
  'scripts/qa/run-ux-g02-validation.ts',
  'reports/archive/2026-06/epis2-ux-command-first-consolidated-2026-06-07.md',
];

for (const rel of requiredFiles) {
  if (!existsSync(join(root, rel))) {
    errors.push(`falta archivo gate: ${rel}`);
  }
}

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const catalog = JSON.parse(readFileSync(join(root, 'tools/gates/catalog-full.json'), 'utf8'));

function resolveCatalogGate(name) {
  return catalog.gates?.[name] ?? catalog.archived?.[name] ?? null;
}

for (const script of [
  'quality:ux-g02',
  'quality:ux-pilot',
  'test:e2e:ux-g02',
  'test:e2e:login-gateway',
]) {
  if (pkg.scripts?.[script]) {
    errors.push(`package.json root no debe definir ${script} (catálogo o tool:script)`);
  }
}

for (const gate of ['quality:ux-g02', 'quality:ux-pilot', 'quality:ux-lab-close']) {
  if (!resolveCatalogGate(gate)) {
    errors.push(`catalog-full.json sin ${gate} (gates o archived)`);
  }
}

const archive = JSON.parse(
  readFileSync(join(root, 'tools/legacy-scripts/root-script-archive.json'), 'utf8'),
);
for (const script of ['test:e2e:ux-g02', 'test:e2e:login-gateway']) {
  if (!archive.scripts?.[script]) {
    errors.push(`root-script-archive sin ${script}`);
  }
}

const flatChecks = [
  ['apps/web/src/components/QualityDashboardTab.tsx', 'EpisWorkspaceSection'],
  ['apps/web/src/components/NursingDashboardTab.tsx', 'EpisWorkspaceSection'],
  ['apps/web/src/pages/ResultsInboxPage.tsx', 'EpisWorkspaceSection'],
  ['apps/web/src/components/PatientLongitudinalPanel.tsx', 'EpisWorkspaceSection'],
  ['apps/web/src/pages/LoginPage.tsx', 'EpisAuthScreen'],
  ['apps/web/src/pages/GeneratedClinicalFormPage.tsx', 'ClinicalLayoutActionBar'],
];

for (const [rel, token] of flatChecks) {
  const content = readFileSync(join(root, rel), 'utf8');
  if (!content.includes(token)) {
    errors.push(`${rel} sin ${token}`);
  }
}

for (const rel of [
  'apps/web/src/components/QualityDashboardTab.tsx',
  'apps/web/src/pages/ResultsInboxPage.tsx',
  'apps/web/src/components/PatientLongitudinalPanel.tsx',
]) {
  const content = readFileSync(join(root, rel), 'utf8');
  if (content.includes('Paper variant="outlined"')) {
    errors.push(`${rel} aún usa Paper outlined (LAYOUT-G12)`);
  }
}

if (errors.length) {
  console.error('ux-pilot-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('ux-pilot-gate OK — evidencia estática arco UX command-first presente');
