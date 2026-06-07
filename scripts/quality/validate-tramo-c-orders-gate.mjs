#!/usr/bin/env node
/** MF-TRAMO-C-004 — Enlace órdenes activas desde ficha. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panel = readFileSync(
  join(root, 'apps/web/src/components/PatientLongitudinalPanel.tsx'),
  'utf8',
);
if (!panel.includes('epis2-longitudinal-open-service-orders')) {
  errors.push('PatientLongitudinalPanel sin CTA órdenes servicio');
}

const service = readFileSync(
  join(root, 'apps/web/src/components/ServiceDashboardTab.tsx'),
  'utf8',
);
if (!service.includes('activeOrders')) {
  errors.push('ServiceDashboardTab sin órdenes activas');
}

const e2e = readFileSync(join(root, 'e2e/tramo-c-admission.spec.ts'), 'utf8');
if (!e2e.includes('epis2-longitudinal-open-service-orders')) {
  errors.push('e2e tramo-c sin journey órdenes servicio');
}

if (errors.length) {
  console.error('tramo-c-orders-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-c-orders-gate OK — enlace órdenes activas servicio');
