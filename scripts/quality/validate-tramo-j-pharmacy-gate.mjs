#!/usr/bin/env node
/** MF-TRAMO-J-002 — Compatibilidad Y-Site (IDC 161). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const registry = readFileSync(
  join(root, 'apps/web/src/navigation/clinicalWorkspaceRegistry.ts'),
  'utf8',
);
if (!registry.includes("route: '/epis2/dashboard?tab=pharmacy'")) {
  errors.push('registry sin ruta tab=pharmacy');
}

const panel = readFileSync(join(root, 'apps/web/src/components/PharmacyDashboardTab.tsx'), 'utf8');
if (!panel.includes('epis2-dashboard-pharmacy')) errors.push('PharmacyDashboardTab sin testid raíz');
if (!panel.includes('epis2-pharmacy-ysite')) errors.push('PharmacyDashboardTab sin panel IDC 161');
if (!panel.includes('epis2-pharmacy-ysite-rows')) {
  errors.push('PharmacyDashboardTab sin filas Y-Site');
}

const routes = readFileSync(join(root, 'apps/api/src/dashboard/routes.ts'), 'utf8');
if (!routes.includes('/api/dashboard/pharmacy')) errors.push('API sin /api/dashboard/pharmacy');

const api = readFileSync(join(root, 'apps/api/src/dashboard/pharmacy.ts'), 'utf8');
if (!api.includes('idc: 161')) errors.push('pharmacy.ts sin IDC 161 active');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-J-002')) errors.push('matriz sin MF-TRAMO-J-002');

const e2e = join(root, 'e2e/tramo-j-pharmacy.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-j-pharmacy.spec.ts');

if (errors.length) {
  console.error('tramo-j-pharmacy-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-j-pharmacy-gate OK — Y-Site IDC 161 en tablero farmacia');
