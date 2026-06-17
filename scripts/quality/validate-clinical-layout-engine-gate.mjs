#!/usr/bin/env node
/** CICA layout engine — componentes canónicos en @epis2/epis2-ui. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'packages/epis2-ui/src/layout/clinical/clinicalLayoutTokens.ts',
  'packages/epis2-ui/src/layout/clinical/clinicalLayoutEngine.ts',
  'packages/epis2-ui/src/layout/clinical/ClinicalScreen.tsx',
  'packages/epis2-ui/src/layout/clinical/ClinicalSection.tsx',
  'packages/epis2-ui/src/layout/clinical/ClinicalFieldGrid.tsx',
  'packages/epis2-ui/src/layout/clinical/ClinicalLayoutActionBar.tsx',
  'packages/epis2-ui/src/layout/clinical/ClinicalOverflowMenu.tsx',
  'packages/epis2-ui/src/layout/clinical/index.ts',
];

for (const rel of required) {
  try {
    readFileSync(join(root, rel), 'utf8');
  } catch {
    errors.push(`Falta ${rel}`);
  }
}

const engine = readFileSync(
  join(root, 'packages/epis2-ui/src/layout/clinical/clinicalLayoutEngine.ts'),
  'utf8',
);
for (const profile of [
  'patient-search',
  'census',
  'classic-chart',
  'clinical-form',
  'results',
  'paper-mode',
  'orders',
]) {
  if (!engine.includes(`'${profile}'`) && !engine.includes(`"${profile}"`)) {
    errors.push(`clinicalLayoutEngine sin profile ${profile}`);
  }
}

const index = readFileSync(join(root, 'packages/epis2-ui/src/layout/clinical/index.ts'), 'utf8');
for (const exportName of [
  'ClinicalScreen',
  'ClinicalSection',
  'ClinicalFieldGrid',
  'ClinicalLayoutActionBar',
  'ClinicalOverflowMenu',
  'auditCicaScreen',
]) {
  if (!index.includes(exportName)) {
    errors.push(`layout/clinical/index.ts debe exportar ${exportName}`);
  }
}

if (errors.length) {
  console.error('clinical-layout-engine-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('clinical-layout-engine-gate OK — CICA layout engine canónico');
