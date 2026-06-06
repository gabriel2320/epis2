#!/usr/bin/env node
/** MF-OLA1C-003 — Solicitud imagenología (IDC 56). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'packages/clinical-forms/src/blueprints/imaging-request.ts',
  'e2e/ola1c-results-journey.spec.ts',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta: ${rel}`);
}

const e2e = readFileSync(join(root, 'e2e/ola1c-results-journey.spec.ts'), 'utf8');
if (!e2e.includes('epis2-form-imaging_request')) {
  errors.push('e2e ola1c sin formulario imagenología');
}
if (!e2e.includes('imagenología')) {
  errors.push('e2e ola1c sin journey imagenología');
}

const golden = readFileSync(join(root, 'tests/golden-clinical-journey.spec.ts'), 'utf8');
if (!golden.includes('imagenología')) {
  errors.push('golden journey sin imagenología');
}

if (errors.length) {
  console.error('ola1c-imaging-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ola1c-imaging-gate OK — IDC 56 evidencia journey');
