#!/usr/bin/env node
/** MF-DUAL-CHART-05 — Comando launcher delgado + enmienda invariante #6. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const commandPage = readFileSync(join(root, 'apps/web/src/pages/CommandCenterPage.tsx'), 'utf8');
if (
  !commandPage.includes('launcher') &&
  !commandPage.includes('CommandLauncher') &&
  !commandPage.includes('slim')
) {
  errors.push(
    'CommandCenterPage.tsx debe usar layout launcher delgado (CommandLauncher o variant slim)',
  );
}

const invariants = readFileSync(join(root, 'docs/product/PRODUCT_INVARIANTS.md'), 'utf8');
if (
  !invariants.includes('launcher') &&
  !invariants.includes('ADR-002') &&
  !invariants.includes('dual chart')
) {
  errors.push(
    'PRODUCT_INVARIANTS.md debe documentar enmienda #6 (home launcher + ficha workspace)',
  );
}

const adr = readFileSync(join(root, 'docs/adr/ADR-002-dual-chart-modes.md'), 'utf8');
if (adr.includes('Estado:** Propuesto')) {
  errors.push('ADR-002 debe pasar a Aceptado antes de cerrar MF-DUAL-CHART-05');
}

const signoff = join(root, 'docs/product/EPIS2_DUAL_CHART_CLINICAL_SIGNOFF.md');
if (!existsSync(signoff)) {
  errors.push('Falta docs/product/EPIS2_DUAL_CHART_CLINICAL_SIGNOFF.md');
}

if (errors.length) {
  console.error('dual-chart-launcher-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('dual-chart-launcher-gate OK — MF-DUAL-CHART-05 launcher + invariante');
