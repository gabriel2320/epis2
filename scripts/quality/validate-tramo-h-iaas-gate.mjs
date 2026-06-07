#!/usr/bin/env node
/** MF-TRAMO-H-002 — Matriz vigilancia activa (IDC 141). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/QualityDashboardTab.tsx'), 'utf8');
if (!panel.includes('epis2-iaas-advanced-idc-panels')) {
  errors.push('QualityDashboardTab sin bloque IAAS advanced idc');
}
if (!panel.includes('epis2-iaas-surveillance-matrix')) {
  errors.push('QualityDashboardTab sin panel IDC 141 matriz vigilancia');
}
if (!panel.includes('epis2-iaas-surveillance-matrix-rows')) {
  errors.push('QualityDashboardTab sin filas matriz vigilancia');
}

const api = readFileSync(join(root, 'apps/api/src/dashboard/quality.ts'), 'utf8');
if (!api.includes('idc: 141')) errors.push('quality.ts sin IDC 141 active');
if (!api.includes('surveillanceMatrix')) errors.push('quality.ts sin surveillanceMatrix');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-H-002')) errors.push('matriz sin MF-TRAMO-H-002');

const e2e = join(root, 'e2e/tramo-h-iaas.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-h-iaas.spec.ts');

if (errors.length) {
  console.error('tramo-h-iaas-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-h-iaas-gate OK — matriz vigilancia IDC 141 en tablero calidad');
