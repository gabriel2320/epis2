#!/usr/bin/env node
/** MF-NORM-08 — motion transición modo + sección ficha dual. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const motion = readFileSync(join(root, 'packages/epis2-ui/src/theme/motion.ts'), 'utf8');
if (!motion.includes('epis2ChartContentTransitionSx')) {
  errors.push('motion.ts debe exportar epis2ChartContentTransitionSx');
}

for (const [rel, needle] of [
  ['apps/web/src/components/chart/ClinicalShell.tsx', 'epis2ChartContentTransitionSx'],
  ['apps/web/src/components/chart/TraditionalClinicalPanel.tsx', 'epis2ChartContentTransitionSx'],
]) {
  const src = readFileSync(join(root, rel), 'utf8');
  if (!src.includes(needle)) errors.push(`${rel} debe usar ${needle}`);
}

if (!existsSync(join(root, 'reports/archive/2026-06/epis2-mf-norm-08-motion.md'))) {
  errors.push('falta reports/archive/2026-06/epis2-mf-norm-08-motion.md');
}

if (errors.length) {
  console.error('ficha-norm-motion-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ficha-norm-motion-gate OK — MF-NORM-08');
