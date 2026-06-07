#!/usr/bin/env node
/** MF-TRAMO-F-002 — Tablero APS + control cardiovascular (IDC 121). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const registry = readFileSync(
  join(root, 'apps/web/src/navigation/clinicalWorkspaceRegistry.ts'),
  'utf8',
);
if (!registry.includes("route: '/epis2/dashboard?tab=aps'")) {
  errors.push('registry sin ruta tab=aps');
}

const panel = readFileSync(join(root, 'apps/web/src/components/ApsDashboardTab.tsx'), 'utf8');
if (!panel.includes('epis2-aps-dashboard')) errors.push('ApsDashboardTab sin testid raíz');
if (!panel.includes('epis2-aps-cardiovascular')) {
  errors.push('ApsDashboardTab sin panel IDC 121');
}

const routes = readFileSync(join(root, 'apps/api/src/dashboard/routes.ts'), 'utf8');
if (!routes.includes('/api/dashboard/aps')) errors.push('API sin /api/dashboard/aps');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-F-002')) errors.push('matriz sin MF-TRAMO-F-002');

const e2e = join(root, 'e2e/tramo-f-aps.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-f-aps.spec.ts');

if (errors.length) {
  console.error('tramo-f-aps-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-f-aps-gate OK — tablero APS + control cardiovascular IDC 121');
