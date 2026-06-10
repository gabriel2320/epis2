#!/usr/bin/env node
/** MF-TRAMO-C-005 — Tendencias clínicas en bandeja resultados (IDC 58). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const trends = readFileSync(join(root, 'apps/web/src/components/ResultsInboxTrends.tsx'), 'utf8');
for (const token of [
  'epis2-results-trends',
  'epis2-results-chart-inr',
  'copy.results.trendsSection',
  'buildObservationTrend',
]) {
  if (!trends.includes(token)) errors.push(`ResultsInboxTrends sin ${token}`);
}

const page = readFileSync(join(root, 'apps/web/src/pages/ResultsInboxPage.tsx'), 'utf8');
if (!page.includes('ResultsInboxTrends')) {
  errors.push('ResultsInboxPage sin ResultsInboxTrends');
}

const e2e = join(root, 'e2e/tramo-c-trends.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-c-trends.spec.ts');
else {
  const spec = readFileSync(e2e, 'utf8');
  if (!spec.includes('epis2-results-trends')) {
    errors.push('e2e tramo-c-trends sin epis2-results-trends');
  }
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-C-005')) {
  errors.push('IDC 58 sin nota MF-TRAMO-C-005');
}

if (errors.length) {
  console.error('tramo-c-trends-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-c-trends-gate OK — tendencias bandeja resultados (IDC 58)');
