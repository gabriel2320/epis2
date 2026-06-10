#!/usr/bin/env node
/** MF-CLINICAL-TEXTBOX-TOOLS — snippets clínicos trazables. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const snippetsPath = join(root, 'packages/clinical-productivity/src/textbox/clinicalSnippets.ts');
const coreSnippets = join(root, 'packages/clinical-productivity/src/snippets/clinicalSnippets.ts');

if (!existsSync(snippetsPath)) errors.push('Falta textbox/clinicalSnippets.ts');
if (!existsSync(coreSnippets)) errors.push('Falta snippets/clinicalSnippets.ts');

const textboxSrc = readFileSync(snippetsPath, 'utf8');
for (const trigger of ['.soap', '.alta', '.uci']) {
  if (!textboxSrc.includes(`'${trigger}'`)) {
    errors.push(`TEXTBOX_PRIMARY_SNIPPET_TRIGGERS debe incluir ${trigger}`);
  }
}

const coreSrc = readFileSync(coreSnippets, 'utf8');
for (const trigger of ['.soap', '.alta', '.uci', '.epicrisis', '.iaas']) {
  if (!coreSrc.includes(`trigger: '${trigger}'`)) {
    errors.push(`clinicalSnippets core debe definir ${trigger}`);
  }
}

if (!textboxSrc.includes('TEXTBOX_EXTENDED_SNIPPET_TRIGGERS')) {
  errors.push(
    'textbox/clinicalSnippets debe exponer TEXTBOX_EXTENDED_SNIPPET_TRIGGERS (.epicrisis, .iaas)',
  );
}
if (!textboxSrc.includes('expandClinicalSnippet')) {
  errors.push('textbox/clinicalSnippets debe re-exportar expandClinicalSnippet');
}

if (errors.length) {
  console.error('clinical-snippets-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('clinical-snippets-gate OK — snippets .soap/.alta/.uci/.epicrisis/.iaas');
