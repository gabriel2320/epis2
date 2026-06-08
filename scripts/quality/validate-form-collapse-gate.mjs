#!/usr/bin/env node
/** MF-RAD-M3-A — formularios largos con acordeones. */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const form = join(root, 'packages/epis2-ui/src/forms/EpisClinicalForm.tsx');
const formPage = join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx');

if (!existsSync(form)) errors.push('Falta EpisClinicalForm.tsx');
if (!existsSync(formPage)) errors.push('Falta GeneratedClinicalFormPage.tsx');

const formSrc = readFileSync(form, 'utf8');
if (!formSrc.includes('collapseNonPrimarySections')) {
  errors.push('EpisClinicalForm sin collapseNonPrimarySections');
}
if (!formSrc.includes('<Accordion')) errors.push('EpisClinicalForm sin acordeones');

const pageSrc = readFileSync(formPage, 'utf8');
if (!pageSrc.includes('collapseNonPrimarySections')) {
  errors.push('GeneratedClinicalFormPage no activa colapso de secciones');
}

if (errors.length) {
  console.error('form-collapse-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('form-collapse-gate OK — acordeones en formularios largos');
