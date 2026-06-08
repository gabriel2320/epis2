#!/usr/bin/env node
/** MF-UI-SIMPLIFY-M3 — meta-gate de simplificación visual. */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const subGates = [
  'validate-m3-scaffold-gate.mjs',
  'validate-duplicate-actions-gate.mjs',
  'validate-icon-budget-gate.mjs',
  'validate-scroll-discipline-gate.mjs',
  'validate-split-pane-gate.mjs',
  'validate-bulk-actions-gate.mjs',
  'validate-drag-drop-safety-gate.mjs',
  'validate-copy-paste-safety-gate.mjs',
  'validate-ui-density-gate.mjs',
];

for (const script of subGates) {
  const r = spawnSync('node', [join(root, 'scripts/quality', script)], {
    cwd: root,
    encoding: 'utf8',
  });
  if (r.status !== 0) {
    errors.push(`${script} falló:\n${r.stdout ?? ''}${r.stderr ?? ''}`);
  }
}

if (errors.length) {
  console.error('ui-simplify-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('ui-simplify-gate OK — MF-UI-SIMPLIFY-M3 gates pasaron');
