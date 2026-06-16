#!/usr/bin/env node
/** MF-LEG-01 — checklist revisión legal + archivos raíz (PROG-POST-RC3 Tramo 3). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const checklistPath = join(root, 'docs/legal/EPIS2_LEGAL_REVIEW_CHECKLIST.md');
const rootLegal = ['LICENSE', 'SECURITY.md', 'DISCLAIMER.md', 'CONTRIBUTING.md'];

if (!existsSync(checklistPath)) {
  errors.push(`Falta checklist: ${checklistPath}`);
} else {
  const src = readFileSync(checklistPath, 'utf8');
  for (const needle of ['MF-LEG-01', 'MF-LEG-02', 'Sign-off humano', 'DISCLAIMER.md']) {
    if (!src.includes(needle)) errors.push(`checklist falta ${needle}`);
  }
}

for (const file of rootLegal) {
  const path = join(root, file);
  if (!existsSync(path)) errors.push(`Falta archivo legal raíz: ${file}`);
}

const disclaimerPath = join(root, 'DISCLAIMER.md');
if (existsSync(disclaimerPath)) {
  const src = readFileSync(disclaimerPath, 'utf8');
  if (!src.includes('**Versión:** 1.0')) {
    errors.push('DISCLAIMER.md debe permanecer v1.0 hasta sign-off MF-LEG-02');
  }
  if (src.includes('**Versión:** 1.1') && !process.env.EPIS2_LEGAL_V11_APPROVED) {
    errors.push(
      'DISCLAIMER v1.1 requiere sign-off humano (EPIS2_LEGAL_V11_APPROVED=1 tras MF-LEG-02)',
    );
  }
}

if (errors.length) {
  console.error('legal-disclaimer-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('legal-disclaimer-gate OK — MF-LEG-01 checklist + archivos raíz');
