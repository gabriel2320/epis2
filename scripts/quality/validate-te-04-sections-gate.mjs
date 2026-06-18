#!/usr/bin/env node
/** MF-TE-04 — batch 3 secciones + nav móvil. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of ['packages/test-fixtures/src/demoChartSections.ts']) {
  if (!existsSync(join(root, rel))) errors.push(`falta ${rel}`);
}

const demo = readFileSync(join(root, 'packages/test-fixtures/src/demoChartSections.ts'), 'utf8');
for (const section of ['navAdmin', 'navDocuments', 'navEpicrisis', 'navProcedures', 'navAudit']) {
  if (!demo.includes(section)) errors.push(`demoChartSections falta ${section}`);
}

if (!existsSync(join(root, 'reports/archive/2026-06/epis2-mf-te-04-sections-p3-mobile.md'))) {
  errors.push('falta reports/archive/2026-06/epis2-mf-te-04-sections-p3-mobile.md');
}

if (errors.length) {
  console.error('te-04-sections-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('te-04-sections-gate OK — MF-TE-04');
