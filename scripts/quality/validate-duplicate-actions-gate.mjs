#!/usr/bin/env node
/** MF-UI-SIMPLIFY — una ActionBar clínica global por formulario. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const formPage = readFileSync(
  join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'),
  'utf8',
);
const actionBarCount =
  (formPage.match(/<ClinicalLayoutActionBar/g) ?? []).length +
  (formPage.match(/<EpisClinicalFormActionBar/g) ?? []).length;
if (actionBarCount !== 1) {
  errors.push(`GeneratedClinicalFormPage: una ActionBar (encontradas ${actionBarCount})`);
}

const forbiddenGlobalInCards = [
  [formPage, 'Guardar borrador', 'acción global duplicada en form page'],
];

for (const [src, token, msg] of forbiddenGlobalInCards) {
  const cardMatches = (src.match(/EpisWorkspaceSection/g) ?? []).length;
  if (cardMatches > 0 && src.includes(`>${token}<`)) {
    errors.push(msg);
  }
}

const rules = readFileSync(join(root, 'apps/web/src/quality/uiDensityRules.ts'), 'utf8');
if (!rules.includes('EPIS_GLOBAL_CLINICAL_ACTIONS')) {
  errors.push('uiDensityRules sin mapa de acciones globales');
}

if (errors.length) {
  console.error('duplicate-actions-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('duplicate-actions-gate OK — acciones globales no duplicadas');
