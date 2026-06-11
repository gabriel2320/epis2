#!/usr/bin/env node
/** MF-DUAL-CHART-08 — Flujo census-first post-login. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const plan = readFileSync(join(root, 'docs/product/EPIS2_DUAL_CHART_DEV_PLAN.md'), 'utf8');
if (!plan.includes('Census-first')) errors.push('Plan debe documentar census-first MF-08');

const command = readFileSync(join(root, 'apps/web/src/pages/CommandCenterPage.tsx'), 'utf8');
if (
  !command.includes('census') &&
  !command.includes('Census') &&
  !command.includes('slim') &&
  !command.includes('search-only')
) {
  errors.push('CommandCenterPage debe reducirse a búsqueda/censo (MF-DUAL-CHART-08)');
}

const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
if (!router.includes('/espacio/buscar-paciente')) {
  errors.push('router debe mantener ruta censo /espacio/buscar-paciente');
}

const canon = join(root, 'docs/design/EPIS2_DUAL_CHART_VISUAL_CANON.md');
if (!existsSync(canon)) errors.push('Falta EPIS2_DUAL_CHART_VISUAL_CANON.md');

if (errors.length) {
  console.error('dual-chart-census-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('dual-chart-census-gate OK — MF-DUAL-CHART-08 census-first');
