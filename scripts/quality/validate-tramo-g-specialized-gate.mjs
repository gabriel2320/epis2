#!/usr/bin/env node
/** MF-TRAMO-G-002 — Prueba ventilación espontánea (IDC 131). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(join(root, 'apps/web/src/components/IcuDashboardTab.tsx'), 'utf8');
if (!panel.includes('epis2-icu-specialized-idc-panels')) {
  errors.push('IcuDashboardTab sin bloque specialized idc');
}
if (!panel.includes('epis2-icu-spontaneous-vent')) {
  errors.push('IcuDashboardTab sin panel IDC 131 SBT');
}
if (!panel.includes('epis2-icu-spontaneous-vent-rows')) {
  errors.push('IcuDashboardTab sin filas SBT');
}

const api = readFileSync(join(root, 'apps/api/src/dashboard/icu.ts'), 'utf8');
if (!api.includes('idc: 131')) errors.push('icu.ts sin IDC 131 active');
if (!api.includes('spontaneousVentTrials')) errors.push('icu.ts sin spontaneousVentTrials');

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes('MF-TRAMO-G-002')) errors.push('matriz sin MF-TRAMO-G-002');

const e2e = join(root, 'e2e/tramo-g-icu.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-g-icu.spec.ts');

if (errors.length) {
  console.error('tramo-g-specialized-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-g-specialized-gate OK — SBT IDC 131 en tablero UCI');
