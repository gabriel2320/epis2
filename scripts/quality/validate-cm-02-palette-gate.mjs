#!/usr/bin/env node
/** MF-CM-02 — Ctrl+K paleta: misma resolución NL + fuzzy + E2E dual chart. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const paths = {
  palette: join(root, 'packages/clinical-productivity/src/components/ClinicalCommandPalette.tsx'),
  fuzzy: join(
    root,
    'packages/clinical-productivity/src/components/filterClinicalCommandPaletteItems.ts',
  ),
  shellPalette: join(root, 'apps/web/src/components/ClinicalShellCommandPalette.tsx'),
  buildItems: join(root, 'apps/web/src/clinical/buildClinicalCommandPaletteItems.ts'),
  e2e: join(root, 'e2e/dual-chart-modes.spec.ts'),
};

for (const [label, path] of Object.entries(paths)) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

const palette = readFileSync(paths.palette, 'utf8');
for (const needle of [
  'filterClinicalCommandPaletteItems',
  'onSubmitNaturalLanguage',
  'handleQueryKeyDown',
]) {
  if (!palette.includes(needle)) errors.push(`ClinicalCommandPalette falta ${needle}`);
}

const shell = readFileSync(paths.shellPalette, 'utf8');
if (!shell.includes('onSubmitNaturalLanguage={runCommand}')) {
  errors.push('ClinicalShellCommandPalette debe pasar onSubmitNaturalLanguage=runCommand');
}
if (!shell.includes('useClinicalCommandSubmit')) {
  errors.push(
    'ClinicalShellCommandPalette debe usar useClinicalCommandSubmit (misma vía que barra)',
  );
}

const build = readFileSync(paths.buildItems, 'utf8');
if (!build.includes('clinicalCommandTextForDefinition')) {
  errors.push('buildClinicalCommandPaletteItems debe exportar clinicalCommandTextForDefinition');
}

const e2e = readFileSync(paths.e2e, 'utf8');
for (const needle of [
  'MF-CM-02',
  'epis2-command-palette-item-create_evolution_draft',
  'chartMode=paper',
]) {
  if (!e2e.includes(needle)) errors.push(`dual-chart-modes.spec.ts falta evidencia ${needle}`);
}

if (!existsSync(join(root, 'reports/archive/2026-06/epis2-mf-cm-02-palette-nl.md'))) {
  errors.push('falta reports/archive/2026-06/epis2-mf-cm-02-palette-nl.md');
}

if (errors.length) {
  console.error('cm-02-palette-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('cm-02-palette-gate OK — MF-CM-02');
