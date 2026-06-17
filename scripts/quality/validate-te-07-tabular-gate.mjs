#!/usr/bin/env node
/** MF-TE-07 — densidad tabular órdenes/MAR en ficha tradicional. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const denseUtil = join(root, 'packages/clinical-productivity/src/tables/clinicalDenseTabular.ts');
const denseGrid = join(
  root,
  'apps/web/src/components/chart/sections/TraditionalDenseSectionGrid.tsx',
);
const orders = join(root, 'apps/web/src/components/chart/sections/TraditionalOrdersSection.tsx');
const meds = join(root, 'apps/web/src/components/chart/sections/TraditionalMedsSection.tsx');
const index = join(root, 'packages/clinical-productivity/src/index.ts');

for (const [label, path] of [
  ['clinicalDenseTabular', denseUtil],
  ['TraditionalDenseSectionGrid', denseGrid],
  ['TraditionalOrdersSection', orders],
  ['TraditionalMedsSection', meds],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

const indexSrc = readFileSync(index, 'utf8');
for (const needle of ['mapLabelValueRowsToDenseTabular', 'mapMarRowsToDenseTabular']) {
  if (!indexSrc.includes(needle))
    errors.push(`clinical-productivity index debe exportar ${needle}`);
}

const gridSrc = readFileSync(denseGrid, 'utf8');
if (!gridSrc.includes('ClinicalDataGrid')) {
  errors.push('TraditionalDenseSectionGrid debe usar ClinicalDataGrid');
}

const ordersSrc = readFileSync(orders, 'utf8');
for (const needle of [
  'TraditionalDenseSectionGrid',
  'mapLabelValueRowsToDenseTabular',
  'variant="orders"',
]) {
  if (!ordersSrc.includes(needle)) errors.push(`TraditionalOrdersSection falta ${needle}`);
}

const medsSrc = readFileSync(meds, 'utf8');
for (const needle of ['TraditionalDenseSectionGrid', 'mapMarRowsToDenseTabular', 'variant="mar"']) {
  if (!medsSrc.includes(needle)) errors.push(`TraditionalMedsSection falta ${needle}`);
}

if (!existsSync(join(root, 'reports/archive/2026-06/epis2-mf-te-07-tabular.md'))) {
  errors.push('falta reports/archive/2026-06/epis2-mf-te-07-tabular.md');
}

const vitest = spawnSync(
  'npx',
  ['vitest', 'run', 'packages/clinical-productivity/src/tables/clinicalDenseTabular.test.ts'],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) errors.push('clinicalDenseTabular.test falló');

if (errors.length) {
  console.error('te-07-tabular-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('te-07-tabular-gate OK — MF-TE-07');
