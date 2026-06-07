#!/usr/bin/env node
/** Semana 4 — evals EPIS2_AI_EVALS_LIVE=all en cierre de tramo. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

if (!existsSync(join(root, 'scripts/run-tramo-closure-evals.mjs'))) {
  errors.push('falta run-tramo-closure-evals.mjs');
}

const live = readFileSync(join(root, 'scripts/ai-evals-live.mjs'), 'utf8');
if (!live.includes("EPIS2_AI_EVALS_LIVE === 'all'")) {
  errors.push('ai-evals-live sin modo all');
}

const doc = join(root, 'docs/product/EPIS2_DEV_AGENT_ORCHESTRATION.md');
if (!existsSync(doc)) errors.push('falta EPIS2_DEV_AGENT_ORCHESTRATION.md');

const orchestration = readFileSync(doc, 'utf8');
if (!orchestration.includes('ai:evals:closure')) {
  errors.push('orquestación sin ai:evals:closure');
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
if (!pkg.includes('"ai:evals:closure"')) errors.push('package.json sin ai:evals:closure');

if (errors.length) {
  console.error('tramo-closure-evals-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramo-closure-evals-gate OK — evals all en cierre registrados');
