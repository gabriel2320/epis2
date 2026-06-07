#!/usr/bin/env node
/** MF-TRAMO-C-002 — Workspace urgencias (IDC 101–110). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const doc = join(root, 'docs/product/EPIS2_TRAMO_C_EMERGENCY_INVENTORY.md');
if (!existsSync(doc)) errors.push('falta EPIS2_TRAMO_C_EMERGENCY_INVENTORY.md');

const registry = readFileSync(
  join(root, 'apps/web/src/navigation/clinicalWorkspaceRegistry.ts'),
  'utf8',
);
if (!registry.includes("id: 'emergency'")) errors.push('registry sin workspace emergency');

const panel = readFileSync(
  join(root, 'apps/web/src/components/EmergencyDashboardTab.tsx'),
  'utf8',
);
if (!panel.includes('epis2-emergency-idc-${panel.idc}')) {
  errors.push('EmergencyDashboardTab sin chips IDC dinámicos');
}

const routes = readFileSync(join(root, 'apps/api/src/dashboard/routes.ts'), 'utf8');
if (!routes.includes('/api/dashboard/emergency')) {
  errors.push('API sin /api/dashboard/emergency');
}

const matrix = readFileSync(join(root, 'scripts/product/generate-idc-matrix.mjs'), 'utf8');
if (!matrix.includes("101: { estado: 'Active'")) errors.push('IDC 101 no Active');

const e2e = join(root, 'e2e/tramo-c-emergency.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/tramo-c-emergency.spec.ts');

if (errors.length) {
  console.error('tramo-c-emergency-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-c-emergency-gate OK — workspace emergency IDC 101+');
