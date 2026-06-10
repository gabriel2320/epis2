#!/usr/bin/env node
/** MF-TRAMO-D-010 — Escalas severidad demo (IDC 47). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/IcuDashboardTab.tsx'), 'utf8');
for (const token of [
  'epis2-icu-severity-scales',
  'epis2-icu-severity-scales-rows',
  'copy.icu.severityScalesTitle',
]) {
  if (!panel.includes(token)) errors.push(`IcuDashboardTab sin ${token}`);
}

const api = readFileSync(join(root, 'apps/api/src/dashboard/icu.ts'), 'utf8');
if (!api.includes('severityScales') || !api.includes('idc: 47')) {
  errors.push('icu.ts sin severityScales o IDC 47 active');
}

const e2e = readFileSync(join(root, 'e2e/tramo-d-icu.spec.ts'), 'utf8');
if (!e2e.includes('epis2-icu-severity-scales')) errors.push('e2e tramo-d sin journey escalas');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-D-010')) errors.push('IDC 47 sin nota MF-TRAMO-D-010');

if (errors.length) {
  console.error(
    'tramo-d-severity-scales-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}
console.log('tramo-d-severity-scales-gate OK — escalas severidad demo (IDC 47)');
