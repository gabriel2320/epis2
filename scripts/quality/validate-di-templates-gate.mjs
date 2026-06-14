#!/usr/bin/env node
/** MF-DI-07 — Plantillas vivas condicionales. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'packages/clinical-domain/src/comorbiditySignals.ts',
  'packages/clinical-domain/src/comorbiditySignals.test.ts',
  'packages/clinical-forms/src/live-templates/definitions.ts',
  'packages/clinical-forms/src/live-templates/resolveLiveTemplate.ts',
  'packages/clinical-forms/src/live-templates/resolveLiveTemplate.test.ts',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const defs = readFileSync(
  join(root, 'packages/clinical-forms/src/live-templates/definitions.ts'),
  'utf8',
);
if (!defs.includes('insulin_hypo_review')) {
  errors.push('definitions.ts debe incluir plantilla insulin_hypo_review');
}
if ((defs.match(/templateId:/g) ?? []).length < 3) {
  errors.push('EPIS2_LIVE_TEMPLATES debe tener al menos 3 plantillas (MF-FF-08)');
}

const formPage = readFileSync(
  join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'),
  'utf8',
);
if (!formPage.includes('materializeLiveTemplateBlueprint')) {
  errors.push('GeneratedClinicalFormPage debe cablear materializeLiveTemplateBlueprint');
}

const types = readFileSync(join(root, 'packages/clinical-forms/src/types.ts'), 'utf8');
if (!types.includes('liveWhen')) {
  errors.push('types.ts debe declarar liveWhen en FormField');
}

const suites = [
  'packages/clinical-domain/src/comorbiditySignals.test.ts',
  'packages/clinical-forms/src/live-templates/resolveLiveTemplate.test.ts',
];

for (const suite of suites) {
  const run = spawnSync('npx', ['vitest', 'run', '--run', suite], {
    cwd: root,
    shell: true,
    encoding: 'utf8',
  });
  if (run.status !== 0) errors.push(`${suite} falló`);
}

if (errors.length) {
  console.error('quality:di-templates-gate — FALLO');
  for (const e of errors) console.error(`  · ${e}`);
  process.exit(1);
}

console.log('quality:di-templates-gate — OK (MF-DI-07)');
