#!/usr/bin/env node
/** Dev agent — política escritura bajo riesgo Ollama. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'docs/product/EPIS2_DEV_AGENT_LOW_RISK_WRITE.md',
  'scripts/dev-agent/low-risk-policy.mjs',
  'scripts/dev-agent/ollama-write.mjs',
  'scripts/dev-agent/low-risk-policy.test.mjs',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta ${rel}`);
}

const policy = readFileSync(join(root, 'scripts/dev-agent/low-risk-policy.mjs'), 'utf8');
for (const token of ['getPathTier', 'applyLowRiskPatches', 'FORBIDDEN_CONTENT_PATTERNS', 'LOW_RISK_TIER_L0_PREFIXES']) {
  if (!policy.includes(token)) errors.push(`low-risk-policy sin ${token}`);
}

const schemas = readFileSync(join(root, 'scripts/dev-agent/schemas.mjs'), 'utf8');
if (!schemas.includes('devLowRiskWritePlanSchema')) {
  errors.push('schemas sin devLowRiskWritePlanSchema');
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
if (!pkg.includes('dev:agent:ollama-write')) {
  errors.push('package.json sin dev:agent:ollama-write');
}

const sub = readFileSync(join(root, 'scripts/dev-agent/subagents.mjs'), 'utf8');
if (!sub.includes('ollama-dev-writer')) errors.push('subagents sin ollama-dev-writer');

if (errors.length) {
  console.error('dev-agent-low-risk-write-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('dev-agent-low-risk-write-gate OK — Ollama dev escritura L0/L1 acotada');
