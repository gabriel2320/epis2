#!/usr/bin/env node
/** MF-DI-04 — Prefill contextual extendido (CE-6). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'packages/clinical-forms/src/chronic-control-prefill.ts',
  'packages/clinical-forms/src/chronic-control-prefill.test.ts',
  'packages/clinical-forms/src/context-clinical-prefill.ts',
  'packages/clinical-forms/src/context-clinical-prefill.test.ts',
  'packages/command-registry/src/slots.ts',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const ctx = readFileSync(
  join(root, 'packages/clinical-forms/src/context-clinical-prefill.ts'),
  'utf8',
);
for (const bp of ['prescription', 'lab_request', 'medical_certificate']) {
  if (!ctx.includes(`case '${bp}'`)) errors.push(`context-clinical-prefill sin case ${bp}`);
}

const slots = readFileSync(join(root, 'packages/command-registry/src/slots.ts'), 'utf8');
if (!slots.includes('Control diabetes mellitus tipo 2')) {
  errors.push('slots.ts debe reconocer control diabetes');
}

const suites = [
  'packages/clinical-forms/src/chronic-control-prefill.test.ts',
  'packages/clinical-forms/src/context-clinical-prefill.test.ts',
  'packages/clinical-forms/src/command-slot-prefill.test.ts',
  'packages/command-registry/src/slots.test.ts',
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
  console.error('quality:di-prefill-gate — FALLO');
  for (const e of errors) console.error(`  · ${e}`);
  process.exit(1);
}

console.log('quality:di-prefill-gate — OK (MF-DI-04)');
