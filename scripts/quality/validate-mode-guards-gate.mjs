#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
for (const f of ['apps/web/src/modes/EpisModeGuard.tsx', 'apps/web/src/modes/episModeGuards.ts']) {
  if (!existsSync(join(root, f))) errors.push(`Falta ${f}`);
}
const guard = readFileSync(join(root, 'apps/web/src/modes/EpisModeGuard.tsx'), 'utf8');
if (!guard.includes('selectPatient') && !guard.includes('EPIS_SELECT_PATIENT_FOR_CLASSIC')) {
  errors.push('Guard debe redirigir classic sin paciente');
}
if (!guard.includes('dashboardPermission')) errors.push('Guard debe validar permiso dashboard');

const layout = readFileSync(join(root, 'apps/web/src/layouts/ClinicalShellLayout.tsx'), 'utf8');
if (!layout.includes('EpisModeGuard')) errors.push('ClinicalShellLayout debe usar EpisModeGuard');

if (errors.length) {
  console.error('mode-guards-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('mode-guards-gate OK');
