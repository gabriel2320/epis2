#!/usr/bin/env node
/** MF-TRAMO-D-002 — Workspace UCI + tablero monitorización (IDC 41). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const registry = readFileSync(
  join(root, 'apps/web/src/navigation/clinicalWorkspaceRegistry.ts'),
  'utf8',
);
if (!registry.includes("route: '/epis2/dashboard?tab=icu'")) {
  errors.push('registry sin rutas tab=icu');
}

const panel = readFileSync(join(root, 'apps/web/src/components/IcuDashboardTab.tsx'), 'utf8');
if (!panel.includes('epis2-icu-dashboard')) errors.push('IcuDashboardTab sin testid raíz');
if (!panel.includes('data-testid={`epis2-icu-idc-${panel.idc}`}')) {
  errors.push('IcuDashboardTab sin chips IDC dinámicos');
}

const routes = readFileSync(join(root, 'apps/api/src/dashboard/routes.ts'), 'utf8');
if (!routes.includes('/api/dashboard/icu')) errors.push('API sin /api/dashboard/icu');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-D-002')) errors.push('IDC 41 sin nota MF-TRAMO-D-002');

const e2e = join(root, 'e2e/tramo-d-icu.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-d-icu.spec.ts');

if (errors.length) {
  console.error('tramo-d-icu-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-d-icu-gate OK — workspace UCI + tablero IDC 41');
