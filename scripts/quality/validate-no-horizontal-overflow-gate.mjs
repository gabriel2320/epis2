#!/usr/bin/env node
/** CICA-L — E2E modo clásico verifica ausencia de scroll horizontal. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const e2ePath = join(root, 'e2e/aesthetic-classic-mode.spec.ts');
if (!existsSync(e2ePath)) {
  errors.push('Falta e2e/aesthetic-classic-mode.spec.ts');
} else {
  const e2e = readFileSync(e2ePath, 'utf8');
  if (!e2e.includes('scrollWidth')) {
    errors.push('aesthetic-classic-mode.spec.ts sin assert scrollWidth vs clientWidth');
  }
  if (!e2e.includes('horizontalOverflow')) {
    errors.push('aesthetic-classic-mode.spec.ts sin variable horizontalOverflow');
  }
  if (!e2e.includes('classic-chart-tab-evolutions')) {
    errors.push('aesthetic-classic-mode.spec.ts sin journey tab Evoluciones (CICA-L-03)');
  }
  if (!e2e.includes('epis2-cica-evolution-form')) {
    errors.push('aesthetic-classic-mode.spec.ts sin journey CICA-L-04 evolución');
  }
  if (!e2e.includes('classic-chart-tab-orders')) {
    errors.push('aesthetic-classic-mode.spec.ts sin journey tab Indicaciones (CICA-L-05)');
  }
  if (!e2e.includes('classic-chart-tab-exams')) {
    errors.push('aesthetic-classic-mode.spec.ts sin journey tab Exámenes (CICA-L-06)');
  }
  if (!e2e.includes('classic-chart-tab-more')) {
    errors.push('aesthetic-classic-mode.spec.ts sin journey tab Más / medicamentos (CICA-L-07)');
  }
  if (!e2e.includes('classic-chart-tab-documents')) {
    errors.push('aesthetic-classic-mode.spec.ts sin journey tab Documentos (CICA-L-08)');
  }
  if (!e2e.includes('epis2-cica-epicrisis-form')) {
    errors.push('aesthetic-classic-mode.spec.ts sin journey CICA-L-09 epicrisis');
  }
  if (!e2e.includes('epis2-paper-standalone-page')) {
    errors.push('aesthetic-classic-mode.spec.ts sin journey CICA-L-10 modo papel');
  }
  if (!e2e.includes('epis2-traditional-section-audit')) {
    errors.push('aesthetic-classic-mode.spec.ts sin journey CICA-L-11 auditoría');
  }
  if (!e2e.includes('data-cica-composition')) {
    errors.push('aesthetic-classic-mode.spec.ts sin assert data-cica-composition');
  }
}

if (errors.length) {
  console.error('no-horizontal-overflow-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('no-horizontal-overflow-gate OK — E2E clásico + overflow + cica-composition');
