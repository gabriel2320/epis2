#!/usr/bin/env node
/**
 * MF-OLA3-002 — Valida evidencia mínima CTAs ficha longitudinal.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const requiredFiles = [
  'apps/web/src/components/PatientLongitudinalPanel.tsx',
  'apps/web/src/components/PatientLongitudinalPanel.test.tsx',
  'e2e/ola3-ficha-journey.spec.ts',
];

for (const rel of requiredFiles) {
  if (!existsSync(join(root, rel))) {
    errors.push(`falta archivo gate: ${rel}`);
  }
}

const panel = readFileSync(
  join(root, 'apps/web/src/components/PatientLongitudinalPanel.tsx'),
  'utf8',
);
for (const token of [
  'onRegisterAllergy',
  'onRegisterProblem',
  'onOpenResults',
  'epis2-longitudinal-register-allergy',
  'epis2-longitudinal-register-problem',
  'epis2-longitudinal-open-results',
]) {
  if (!panel.includes(token)) {
    errors.push(`PatientLongitudinalPanel sin ${token}`);
  }
}

if (errors.length) {
  console.error('ola3-ficha-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('ola3-ficha-gate OK — evidencia estática Ola 3 CTAs presente');
