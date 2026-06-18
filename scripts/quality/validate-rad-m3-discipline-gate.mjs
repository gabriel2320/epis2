#!/usr/bin/env node
/** MF-RAD-M3 — disciplina RAD + superficies + separación UI. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'docs/design/EPIS2_RAD_M3_DISCIPLINE.md',
  'docs/product/EPIS2_GLOBAL_DEV_PLAN.md',
  'apps/web/src/design/radDiscipline.ts',
  'apps/web/src/design/radScreenRegistry.ts',
  'apps/web/src/design/useRadTabIndex.ts',
  'apps/web/src/components/rad/EpisRadScreenShell.tsx',
  'apps/web/src/components/rad/EpisRadGridSurface.tsx',
  'apps/web/src/components/rad/EpisRadDocumentSurface.tsx',
  'packages/epis2-ui/src/clinical/EpisContextMenu.tsx',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const registry = readFileSync(join(root, 'apps/web/src/design/radScreenRegistry.ts'), 'utf8');
const discipline = readFileSync(join(root, 'apps/web/src/design/radDiscipline.ts'), 'utf8');
const formPage = readFileSync(
  join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'),
  'utf8',
);

for (const surface of ['command', 'workspace', 'form', 'grid', 'document']) {
  if (!discipline.includes(`'${surface}'`)) errors.push(`radDiscipline sin superficie ${surface}`);
}

if (!registry.includes('EPIS_RAD_SCREEN_REGISTRY')) {
  errors.push('radScreenRegistry sin inventario auditado');
}

if ((formPage.match(/<EpisClinicalFormActionBar/g) ?? []).length !== 1) {
  errors.push('Formulario clínico debe tener una sola ActionBar');
}

if (errors.length) {
  console.error('rad-m3-discipline-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('rad-m3-discipline-gate OK — disciplina RAD/MD3 consolidada');
