#!/usr/bin/env node
/** MF-PAPER-06 — motor paginación + footer N/M. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const paginatePath = join(
  root,
  'apps/web/src/components/chart/paper/pagination/paginatePaperChart.ts',
);
const footerPath = join(root, 'apps/web/src/components/chart/paper/PaperFooter.tsx');
const testPath = join(
  root,
  'apps/web/src/components/chart/paper/pagination/paginatePaperChart.test.ts',
);

for (const [label, path] of [
  ['paginatePaperChart', paginatePath],
  ['PaperFooter', footerPath],
  ['paginatePaperChart.test', testPath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

if (existsSync(paginatePath)) {
  const src = readFileSync(paginatePath, 'utf8');
  for (const needle of ['estimateBlockLines', 'paginatePaperChart', 'signatureReserve']) {
    if (!src.includes(needle)) errors.push(`paginatePaperChart.ts falta ${needle}`);
  }
}

if (existsSync(footerPath)) {
  const src = readFileSync(footerPath, 'utf8');
  if (!src.includes('epis2-paper-page-footer')) {
    errors.push('PaperFooter falta clase epis2-paper-page-footer');
  }
}

if (errors.length) {
  console.error('paper-mode-pagination-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('paper-mode-pagination-gate OK — MF-PAPER-06 paginación N/M');
