#!/usr/bin/env node
/** MF-CLINICAL-PRODUCTIVITY — autocompletado con confirmación en medicación. */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const path = join(root, 'packages/clinical-productivity/src/components/ClinicalAutocomplete.tsx');
if (!existsSync(path)) errors.push('Falta ClinicalAutocomplete.tsx');

const src = readFileSync(path, 'utf8');
if (!src.includes('requiresConfirmation')) {
  errors.push('ClinicalAutocomplete debe marcar opciones de alto riesgo');
}
if (!src.includes("category === 'medication'")) {
  errors.push('ClinicalAutocomplete debe confirmar medicación');
}
if (!src.includes('findClinicalTerms')) {
  errors.push('ClinicalAutocomplete debe usar diccionario chileno');
}

if (errors.length) {
  console.error('autocomplete-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('autocomplete-gate OK — autocompletado clínico seguro');
