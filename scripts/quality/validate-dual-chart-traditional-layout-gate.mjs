#!/usr/bin/env node
/** MF-DUAL-CHART-05 — TraditionalEhrLayout nav clínico + panel colapsable. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'apps/web/src/components/chart/TraditionalSectionNav.tsx',
  'apps/web/src/components/chart/TraditionalClinicalPanel.tsx',
  'apps/web/src/components/chart/ClinicalRightContextPanel.tsx',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const layout = join(root, 'apps/web/src/components/chart/TraditionalEhrMode.tsx');
if (existsSync(layout)) {
  const src = readFileSync(layout, 'utf8');
  if (!src.includes('TraditionalSectionNav')) {
    errors.push('TraditionalEhrMode debe usar TraditionalSectionNav');
  }
  if (!src.includes('ClinicalRightContextPanel')) {
    errors.push('TraditionalEhrMode debe usar ClinicalRightContextPanel colapsable');
  }
  if (src.includes('Siguiente')) {
    errors.push('TraditionalEhrMode no debe usar botón Siguiente como nav principal');
  }
}

if (errors.length) {
  console.error(
    'dual-chart-traditional-layout-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('dual-chart-traditional-layout-gate OK — MF-DUAL-CHART-05 layout EMR');
