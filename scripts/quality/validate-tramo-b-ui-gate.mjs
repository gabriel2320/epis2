#!/usr/bin/env node
/** MF-TRAMO-B-002 — UI recepción (IDC 2–10). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const registry = readFileSync(
  join(root, 'apps/web/src/navigation/clinicalWorkspaceRegistry.ts'),
  'utf8',
);
if (!registry.includes("id: 'reception'")) errors.push('registry sin workspace reception');

const panel = readFileSync(
  join(root, 'apps/web/src/components/ReceptionDashboardTab.tsx'),
  'utf8',
);
for (const token of [
  'epis2-reception-dashboard',
  'epis2-reception-idc-${panel.idc}',
  'epis2-reception-call-panel',
]) {
  if (!panel.includes(token)) errors.push(`ReceptionDashboardTab sin ${token}`);
}

const routes = readFileSync(join(root, 'apps/api/src/dashboard/routes.ts'), 'utf8');
if (!routes.includes('/api/dashboard/reception')) {
  errors.push('API sin /api/dashboard/reception');
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes("2: { estado: 'Done'")) errors.push('IDC 2 no Done');

const e2e = readFileSync(join(root, 'e2e/tramo-b-reception.spec.ts'), 'utf8');
if (!e2e.includes('epis2-reception-dashboard')) {
  errors.push('e2e tramo-b sin journey recepción');
}

if (errors.length) {
  console.error('tramo-b-ui-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-b-ui-gate OK — recepción IDC 2–10 UI demo');
