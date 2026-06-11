#!/usr/bin/env node
/** MF-CM-01 — barra NL unificada censo · ficha · papel. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const barPath = join(root, 'apps/web/src/components/command/EpisUniversalCommandBar.tsx');
const shellPath = join(root, 'apps/web/src/components/chart/ClinicalShell.tsx');
const dockPath = join(root, 'apps/web/src/components/chart/ChartEspacioCommandDock.tsx');
const layoutPath = join(root, 'packages/epis2-ui/src/command/episUniversalCommandBarLayout.ts');

for (const [label, path] of [
  ['EpisUniversalCommandBar', barPath],
  ['ClinicalShell', shellPath],
  ['ChartEspacioCommandDock', dockPath],
  ['episUniversalCommandBarLayoutSx', layoutPath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

const bar = readFileSync(barPath, 'utf8');
for (const variant of ['clinical-chart', 'census-search']) {
  if (!bar.includes(variant)) errors.push(`EpisUniversalCommandBar falta variant ${variant}`);
}
if (!bar.includes('episUniversalCommandBarLayoutSx')) {
  errors.push('EpisUniversalCommandBar debe usar layout unificado Calm');
}

const shell = readFileSync(shellPath, 'utf8');
if (!shell.includes('variant="clinical-chart"') || !shell.includes('epis2-chart-command-bar')) {
  errors.push('ClinicalShell debe montar barra clinical-chart embedded');
}

const dock = readFileSync(dockPath, 'utf8');
if (!dock.includes("variant={isCensus ? 'census-search' : 'clinical-chart'}")) {
  errors.push('ChartEspacioCommandDock debe alternar census-search / clinical-chart');
}

const layout = readFileSync(layoutPath, 'utf8');
if (!layout.includes('borderRadius: \'16px\'')) {
  errors.push('layout barra debe usar radius Calm 16px');
}

if (!existsSync(join(root, 'reports/epis2-mf-cm-01-barra-unificada.md'))) {
  errors.push('falta reports/epis2-mf-cm-01-barra-unificada.md');
}

if (errors.length) {
  console.error('cm-01-barra-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('cm-01-barra-gate OK — MF-CM-01');
