#!/usr/bin/env node
/** MF-TRAMO-E-002 — Workspace pabellón + tabla quirúrgica (IDC 151). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const registry = readFileSync(
  join(root, 'apps/web/src/navigation/clinicalWorkspaceRegistry.ts'),
  'utf8',
);
if (!registry.includes("route: '/epis2/dashboard?tab=or'")) {
  errors.push('registry sin rutas tab=or');
}

const panel = readFileSync(join(root, 'apps/web/src/components/OrDashboardTab.tsx'), 'utf8');
if (!panel.includes('epis2-or-dashboard')) errors.push('OrDashboardTab sin testid raíz');
if (!panel.includes('epis2-or-surgical-schedule')) {
  errors.push('OrDashboardTab sin tabla quirúrgica IDC 151');
}
if (!panel.includes('data-testid={`epis2-or-idc-${panel.idc}`}')) {
  errors.push('OrDashboardTab sin chips IDC dinámicos');
}

const routes = readFileSync(join(root, 'apps/api/src/dashboard/routes.ts'), 'utf8');
if (!routes.includes('/api/dashboard/or')) errors.push('API sin /api/dashboard/or');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-E-002')) errors.push('IDC 151 sin nota MF-TRAMO-E-002');

const e2e = join(root, 'e2e/tramo-e-or.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-e-or.spec.ts');

if (errors.length) {
  console.error('tramo-e-or-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-e-or-gate OK — workspace pabellón + tabla quirúrgica IDC 151');
