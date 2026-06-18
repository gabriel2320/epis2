#!/usr/bin/env node
/** PROG-EPIS2-LEXICON-CORE — cierre MF-LX-01…06. */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const gates = [
  'validate-clinical-action-manifest-gate.mjs',
  'validate-clinical-lexicon-es-cl-gate.mjs',
  'validate-drug-dictionary-cl-gate.mjs',
  'validate-lab-dictionary-gate.mjs',
  'validate-clinical-rules-gate.mjs',
  'validate-ai-escalation-gate.mjs',
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
  console.error('lexicon-core-close-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('lexicon-core-close-gate OK — PROG-EPIS2-LEXICON-CORE MF-LX-01…06');
