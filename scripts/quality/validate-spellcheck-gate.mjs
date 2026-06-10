#!/usr/bin/env node
/** MF-CLINICAL-PRODUCTIVITY — spellcheck sugiere, no autocorrige. */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const spellPath = join(
  root,
  'packages/clinical-productivity/src/components/ClinicalSpellCheck.tsx',
);
const dictPath = join(
  root,
  'packages/clinical-productivity/src/dictionaries/chileClinicalDictionary.ts',
);

if (!existsSync(spellPath)) errors.push('Falta ClinicalSpellCheck.tsx');
if (!existsSync(dictPath)) errors.push('Falta chileClinicalDictionary.ts');

const spellSrc = readFileSync(spellPath, 'utf8');
if (spellSrc.includes('replace(') && spellSrc.includes('text')) {
  errors.push('ClinicalSpellCheck no debe reemplazar texto silenciosamente');
}
if (!spellSrc.includes('isWhitelistedClinicalTerm')) {
  errors.push('ClinicalSpellCheck debe respetar lista blanca');
}
if (!spellSrc.includes('spellSuggestions')) {
  errors.push('ClinicalSpellCheck debe mostrar sugerencias visibles');
}

if (errors.length) {
  console.error('spellcheck-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('spellcheck-gate OK — corrector clínico no invasivo');
