#!/usr/bin/env node
/** PROG-AESTHETIC-RESET — cierre compuesto MF-AEST-01…06 (fases implementadas). */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const gates = [
  'validate-aesthetic-action-density-gate.mjs',
  'validate-aesthetic-layout-gate.mjs',
  'validate-classic-chart-composition-gate.mjs',
  'validate-classic-shell-layout-gate.mjs',
  'validate-clinical-command-bar-transversal-gate.mjs',
  'validate-clinical-layout-engine-gate.mjs',
  'validate-clinical-navigation-clarity-gate.mjs',
  'validate-cica-screen-admission-gate.mjs',
  'validate-paper-mode-standalone-gate.mjs',
  'validate-patient-search-layout-gate.mjs',
  'validate-clinical-calm-default-gate.mjs',
  'validate-cica-screen-governor-gate.mjs',
  'validate-ui-density-gate.mjs',
  'validate-duplicate-actions-gate.mjs',
];

for (const script of gates) {
  const r = spawnSync('node', [join(root, 'scripts/quality', script)], {
    cwd: root,
    encoding: 'utf8',
  });
  if (r.status !== 0) {
    errors.push(`${script} falló:\n${r.stdout ?? ''}${r.stderr ?? ''}`);
  }
}

if (errors.length) {
  console.error('aesthetic-reset-close-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('aesthetic-reset-close-gate OK — PROG-AESTHETIC-RESET gates base verdes');
