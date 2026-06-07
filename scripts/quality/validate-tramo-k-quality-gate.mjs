#!/usr/bin/env node
/** MF-TRAMO-K-002 — Eventos adversos / centinela (IDC 171). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const registry = readFileSync(
  join(root, 'apps/web/src/navigation/clinicalWorkspaceRegistry.ts'),
  'utf8',
);
if (!registry.includes("route: '/epis2/dashboard?tab=quality'")) {
  errors.push('registry sin ruta tab=quality');
}

const panel = readFileSync(join(root, 'apps/web/src/components/QualityDashboardTab.tsx'), 'utf8');
if (!panel.includes('epis2-quality-sentinel')) errors.push('QualityDashboardTab sin panel IDC 171');
if (!panel.includes('epis2-quality-sentinel-rows')) {
  errors.push('QualityDashboardTab sin filas centinela');
}

const routes = readFileSync(join(root, 'apps/api/src/dashboard/routes.ts'), 'utf8');
if (!routes.includes('/api/dashboard/quality')) errors.push('API sin /api/dashboard/quality');

const api = readFileSync(join(root, 'apps/api/src/dashboard/quality.ts'), 'utf8');
if (!api.includes('idc: 171')) errors.push('quality.ts sin IDC 171 active');
if (!api.includes('sentinelEvents')) errors.push('quality.ts sin sentinelEvents');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-K-002')) errors.push('matriz sin MF-TRAMO-K-002');

const e2e = join(root, 'e2e/tramo-k-quality.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-k-quality.spec.ts');

if (errors.length) {
  console.error('tramo-k-quality-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-k-quality-gate OK — centinela IDC 171 en tablero calidad');
