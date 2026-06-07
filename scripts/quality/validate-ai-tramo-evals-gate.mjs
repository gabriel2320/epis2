#!/usr/bin/env node
/** Semana 3 — evals Ollama mapeados por tramo activo J. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const map = readFileSync(join(root, 'scripts/ai-tramo-blueprints.mjs'), 'utf8');
if (!map.includes("J: ['pharmacy_validation'")) {
  errors.push('ai-tramo-blueprints sin tramo J farmacia');
}

const live = readFileSync(join(root, 'scripts/ai-evals-live.mjs'), 'utf8');
if (!live.includes('EPIS2_AI_EVALS_TRAMO')) errors.push('ai-evals-live sin EPIS2_AI_EVALS_TRAMO');
if (!live.includes('computeEvalMetrics')) errors.push('ai-evals-live sin métricas p95');

const metrics = readFileSync(join(root, 'scripts/ai-evals-metrics.mjs'), 'utf8');
if (!metrics.includes('p95LatencyMs')) errors.push('ai-evals-metrics sin p95');

const doc = join(root, 'docs/product/EPIS2_AI_TRAMO_EVALS.md');
if (!existsSync(doc)) errors.push('falta EPIS2_AI_TRAMO_EVALS.md');

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
if (!pkg.includes('"ai:evals:tramo-j"')) errors.push('package.json sin ai:evals:tramo-j');

if (errors.length) {
  console.error('ai-tramo-evals-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ai-tramo-evals-gate OK — evals Ollama por tramo J documentados');
