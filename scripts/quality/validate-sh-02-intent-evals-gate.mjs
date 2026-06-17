#!/usr/bin/env node
/** MF-SH-02 — evals intent top-10 + ai:evals:live (requiere dev:ai + Ollama). */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  ['intent top10 fixture', 'packages/command-registry/src/command-intent-top10.ts'],
  ['intent top10 runner', 'scripts/ai/evals/run-intent-top10-evals.mjs'],
  ['closure report', 'reports/archive/2026-06/epis2-mf-sh-02-intent-evals.md'],
];

for (const [label, rel] of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${label}: ${rel}`);
}

function run(label, cmd, args) {
  const result = spawnSync(cmd, args, { cwd: root, shell: true, stdio: 'inherit' });
  if (result.status !== 0) errors.push(`${label} falló`);
}

run('ai:evals:intent-top10', 'node', ['scripts/ai/evals/run-intent-top10-evals.mjs']);

if (errors.length) {
  console.error('sh-02-intent-evals-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  console.error('\nLive assist: npm run dev:ai && npm run ai:evals:live');
  process.exit(1);
}

console.log('sh-02-intent-evals-gate OK — MF-SH-02 (live: npm run ai:evals:live con dev:ai)');
