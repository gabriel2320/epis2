#!/usr/bin/env node
/** FASE 1 PROG-AESTHETIC-RESET — shell clínico mínimo sin sidebar ni switcher deprecado. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'apps/web/src/layouts/ClinicalNavStrip.tsx',
  'apps/web/src/layouts/ClinicalShellLayout.tsx',
]) {
  try {
    readFileSync(join(root, rel), 'utf8');
  } catch {
    errors.push(`Falta ${rel}`);
  }
}

const shell = readFileSync(join(root, 'apps/web/src/layouts/ClinicalShellLayout.tsx'), 'utf8');
if (!shell.includes('ClinicalNavStrip')) {
  errors.push('ClinicalShellLayout debe usar ClinicalNavStrip');
}
if (!shell.includes('isDualChartMinimalShell')) {
  errors.push('ClinicalShellLayout sin rama isDualChartMinimalShell');
}
if (!shell.includes('epis2-clinical-shell-minimal')) {
  errors.push('ClinicalShellLayout sin testId epis2-clinical-shell-minimal');
}
if (!shell.includes('railHidden={dualChartEnabled}')) {
  errors.push('ClinicalShellLayout debe ocultar rail cuando dual ficha activa');
}

const topBar = readFileSync(join(root, 'apps/web/src/layouts/ClinicalGlobalTopBar.tsx'), 'utf8');
if (!topBar.includes('ClinicalNavStrip')) {
  errors.push('ClinicalGlobalTopBar debe delegar en ClinicalNavStrip (dual ficha)');
}

const switcher = readFileSync(
  join(root, 'apps/web/src/components/modes/EpisModeSwitcher.tsx'),
  'utf8',
);
if (!switcher.includes('isDualChartModesEnabled')) {
  errors.push('EpisModeSwitcher debe ocultarse cuando dual ficha está activa');
}

const nav = readFileSync(join(root, 'apps/web/src/layouts/ClinicalNavStrip.tsx'), 'utf8');
for (const token of [
  'epis2-clinical-nav-census',
  'epis2-clinical-nav-search',
  'epis2-clinical-nav-ficha',
  'epis2-clinical-nav-paper',
  'epis2-clinical-nav-more',
]) {
  if (!nav.includes(token)) {
    errors.push(`ClinicalNavStrip falta ${token}`);
  }
}
if (nav.includes('Modo tablero') || nav.includes('threeModes.dashboardLabel')) {
  errors.push('ClinicalNavStrip no debe mostrar Modo tablero como nav principal');
}

const copy = readFileSync(join(root, 'packages/design-system/src/copy/es.ts'), 'utf8');
if (!copy.includes('clinicalNav:')) {
  errors.push('copy/es.ts sin bloque clinicalNav');
}

if (errors.length) {
  console.error('classic-shell-layout-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('classic-shell-layout-gate OK — FASE 1 shell clínico mínimo');
