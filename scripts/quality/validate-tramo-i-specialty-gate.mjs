#!/usr/bin/env node
/** MF-TRAMO-I-002 — Partograma obstétrico (IDC 181). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const registry = readFileSync(
  join(root, 'apps/web/src/navigation/clinicalWorkspaceRegistry.ts'),
  'utf8',
);
if (!registry.includes("route: '/epis2/dashboard?tab=specialty'")) {
  errors.push('registry sin ruta tab=specialty');
}

const panel = readFileSync(join(root, 'apps/web/src/components/SpecialtyDashboardTab.tsx'), 'utf8');
if (!panel.includes('epis2-specialty-dashboard')) errors.push('SpecialtyDashboardTab sin testid raíz');
if (!panel.includes('epis2-specialty-partogram')) errors.push('SpecialtyDashboardTab sin panel IDC 181');
if (!panel.includes('epis2-specialty-partogram-rows')) {
  errors.push('SpecialtyDashboardTab sin filas partograma');
}

const routes = readFileSync(join(root, 'apps/api/src/dashboard/routes.ts'), 'utf8');
if (!routes.includes('/api/dashboard/specialty')) errors.push('API sin /api/dashboard/specialty');

const api = readFileSync(join(root, 'apps/api/src/dashboard/specialty.ts'), 'utf8');
if (!api.includes('idc: 181')) errors.push('specialty.ts sin IDC 181 active');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-I-002')) errors.push('matriz sin MF-TRAMO-I-002');

const e2e = join(root, 'e2e/tramo-i-specialty.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-i-specialty.spec.ts');

if (errors.length) {
  console.error('tramo-i-specialty-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-i-specialty-gate OK — partograma IDC 181 en tablero especialidades');
