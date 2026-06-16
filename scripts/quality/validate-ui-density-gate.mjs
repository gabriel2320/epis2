#!/usr/bin/env node
/**
 * MF-UI-DENSITY — meta-gate de densidad visual (estático).
 */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

function runGate(script) {
  const r = spawnSync('node', [join(root, 'scripts/quality', script)], {
    cwd: root,
    encoding: 'utf8',
  });
  if (r.status !== 0) {
    errors.push(`${script} falló:\n${r.stdout ?? ''}${r.stderr ?? ''}`);
  }
}

runGate('validate-command-center-layout-gate.mjs');

const formPage = readFileSync(
  join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'),
  'utf8',
);
if (!formPage.includes('ClinicalLayoutActionBar') && !formPage.includes('EpisClinicalFormActionBar')) {
  errors.push('GeneratedClinicalFormPage sin barra de acciones clínica gobernada');
}

const actionBarJsx = (formPage.match(/<ClinicalLayoutActionBar/g) ?? []).length +
  (formPage.match(/<EpisClinicalFormActionBar/g) ?? []).length;
if (actionBarJsx !== 1) {
  errors.push(
    `GeneratedClinicalFormPage debe renderizar una sola ActionBar (encontradas: ${actionBarJsx})`,
  );
}

if (errors.length) {
  console.error('ui-density-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('ui-density-gate OK — MF-UI-DENSITY gates estáticos pasaron');
