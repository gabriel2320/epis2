#!/usr/bin/env node
/** MF-DUAL-CHART-06 — PaperChartLayout v2 toolbar + estética institucional. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'apps/web/src/components/chart/PaperDocumentToolbar.tsx',
  'apps/web/src/components/chart/paper/PaperPageCanvas.tsx',
  'apps/web/src/components/chart/paper/PaperFooter.tsx',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const mode = join(root, 'apps/web/src/components/chart/PaperChartMode.tsx');
if (existsSync(mode)) {
  const src = readFileSync(mode, 'utf8');
  if (!src.includes('PaperDocumentToolbar')) {
    errors.push('PaperChartMode debe usar PaperDocumentToolbar');
  }
}

if (errors.length) {
  console.error(
    'dual-chart-paper-layout-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('dual-chart-paper-layout-gate OK — MF-DUAL-CHART-06 layout papel');
