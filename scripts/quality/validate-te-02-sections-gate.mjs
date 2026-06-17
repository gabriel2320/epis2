#!/usr/bin/env node
/** MF-TE-02 — 5 secciones ficha con contenido demo/real. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'apps/web/src/components/chart/sections/TraditionalAllergiesSection.tsx',
  'apps/web/src/components/chart/sections/TraditionalMedsSection.tsx',
  'apps/web/src/components/chart/sections/TraditionalOrdersSection.tsx',
  'apps/web/src/components/chart/sections/TraditionalLabsSection.tsx',
  'apps/web/src/components/chart/sections/TraditionalEvolutionSection.tsx',
  'apps/web/src/components/chart/sections/index.ts',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta ${rel}`);
}

const ehr = readFileSync(
  join(root, 'apps/web/src/components/chart/TraditionalEhrMode.tsx'),
  'utf8',
);
if (!ehr.includes('resolveTraditionalSectionContent')) {
  errors.push('TraditionalEhrMode debe resolver secciones TE-02');
}

if (!existsSync(join(root, 'reports/archive/2026-06/epis2-mf-te-02-sections-p1.md'))) {
  errors.push('falta reports/archive/2026-06/epis2-mf-te-02-sections-p1.md');
}

if (errors.length) {
  console.error('te-02-sections-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('te-02-sections-gate OK — MF-TE-02');
