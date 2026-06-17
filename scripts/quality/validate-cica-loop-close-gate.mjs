#!/usr/bin/env node
/** CICA-L — cierre tramo: aesthetic-reset + inventario activo + overflow E2E. */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const gates = [
  'validate-aesthetic-reset-close-gate.mjs',
  'validate-cica-screen-inventory-gate.mjs',
  'validate-no-horizontal-overflow-gate.mjs',
  'validate-pr-aest-07-close-gate.mjs',
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
  console.error('cica-loop-close-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('cica-loop-close-gate OK — CICA-L tramo (reset + inventory + overflow)');
