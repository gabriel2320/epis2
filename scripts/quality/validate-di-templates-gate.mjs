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
for (const token of ['requires_ckd', 'requires_insulin', 'renalFunctionReview', 'hypoglycemiaReview']) {
  if (!defs.includes(token)) errors.push(`definitions.ts debe incluir ${token}`);
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
