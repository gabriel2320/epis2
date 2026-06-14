#!/usr/bin/env node
/** MF-DI-09 — Microjourneys post-acción. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'packages/clinical-productivity/src/microjourneys/postSaveMicrojourneys.ts',
  'packages/clinical-productivity/src/microjourneys/postSaveMicrojourneys.test.ts',
  'packages/clinical-productivity/src/admin/chileAdminValidators.ts',
  'apps/web/src/clinical/generated-form/PostSaveMicrojourneyPanel.tsx',
  'apps/web/src/clinical/generated-form/validateGeneratedFormAdmin.ts',
  'apps/web/src/pages/GeneratedClinicalFormPage.tsx',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const journeys = readFileSync(
  join(root, 'packages/clinical-productivity/src/microjourneys/postSaveMicrojourneys.ts'),
  'utf8',
);
for (const token of ['prescription', 'evolution_note', 'lab_request', 'print_rx', 'linked_rx']) {
  if (!journeys.includes(token)) errors.push(`postSaveMicrojourneys.ts sin ${token}`);
}

const page = readFileSync(join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'), 'utf8');
if (!page.includes('GeneratedFormPostSaveMicrojourneys')) {
  errors.push('GeneratedClinicalFormPage debe renderizar microjourneys post-guardado');
}

const e2e = readFileSync(join(root, 'e2e/dual-chart-modes.spec.ts'), 'utf8');
if (!e2e.includes('epis2-post-save-microjourneys')) {
  errors.push('e2e/dual-chart-modes.spec.ts debe verificar microjourneys');
}

const suites = [
  'packages/clinical-productivity/src/microjourneys/postSaveMicrojourneys.test.ts',
  'packages/clinical-productivity/src/admin/chileAdminValidators.test.ts',
  'apps/web/src/clinical/generated-form/validateGeneratedFormAdmin.test.ts',
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
  console.error('quality:di-journeys-gate — FALLO');
  for (const e of errors) console.error(`  · ${e}`);
  process.exit(1);
}

console.log('quality:di-journeys-gate — OK (MF-DI-09)');
