#!/usr/bin/env node
/**
 * MF-OLA1C-002 — Valida evidencia mínima journey órdenes/resultados.
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const requiredFiles = [
  'apps/web/src/pages/ResultsInboxPage.tsx',
  'apps/web/src/pages/ResultsInboxPage.test.tsx',
  'e2e/ola1c-results-journey.spec.ts',
  'apps/api/src/clinical/resultsInbox.integration.test.ts',
];

for (const rel of requiredFiles) {
  if (!existsSync(join(root, rel))) {
    errors.push(`falta archivo gate: ${rel}`);
  }
}

const golden = readFileSync(join(root, 'tests/golden-clinical-journey.spec.ts'), 'utf8');
if (!golden.includes('bandeja de resultados')) {
  errors.push('golden journey sin bandeja de resultados');
}
if (!golden.includes('imagenología')) {
  errors.push('golden journey sin imagenología');
}

const e2e = readFileSync(join(root, 'e2e/ola1c-results-journey.spec.ts'), 'utf8');
if (!e2e.includes('epis2-results-ack-')) {
  errors.push('e2e ola1c sin acuse crítico');
}

if (errors.length) {
  console.error('ola1c-journey-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('ola1c-journey-gate OK — evidencia estática Ola 1C presente');
