#!/usr/bin/env node
/** AI-EXT — Clinical Inference Gateway (ADR-005). */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  ['inference router', 'services/local-ai/src/inference/router.ts'],
  ['inference policy', 'services/local-ai/src/inference/policy.ts'],
  ['openai provider', 'services/local-ai/src/inference/openaiProvider.ts'],
  ['ADR-005', 'docs/adr/ADR-005-external-inference-provider.md'],
  ['report', 'reports/epis2-ai-ext-inference.md'],
];

for (const [label, rel] of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${label}: ${rel}`);
}

const assist = readFileSync(join(root, 'services/local-ai/src/assist.ts'), 'utf8');
if (!assist.includes('generateWithInferenceRouter')) {
  errors.push('assist.ts debe usar generateWithInferenceRouter');
}

const config = readFileSync(join(root, 'services/local-ai/src/config.ts'), 'utf8');
for (const needle of ['AI_INFERENCE_MODE', 'AI_CLOUD_ENABLED', 'OPENAI_API_KEY']) {
  if (!config.includes(needle)) errors.push(`config.ts falta ${needle}`);
}

const apiRoutes = readFileSync(join(root, 'apps/api/src/ai/routes.ts'), 'utf8');
if (!apiRoutes.includes('fetchLocalAiCapabilities') || !apiRoutes.includes('dataTier')) {
  errors.push('ai routes debe enriquecer status y trazar provider/dataTier');
}

const contracts = readFileSync(join(root, 'packages/contracts/src/ai.ts'), 'utf8');
if (!contracts.includes('inferenceMode') || !contracts.includes('provider')) {
  errors.push('contracts ai.ts debe exponer inferenceMode y provider');
}

const vitest = spawnSync(
  'npx',
  [
    'vitest',
    'run',
    'services/local-ai/src/inference/policy.test.ts',
    'services/local-ai/src/inference/router.test.ts',
    'services/local-ai/src/assist.test.ts',
    'services/local-ai/src/gatewayCapabilities.test.ts',
    'apps/api/src/ai/routes.test.ts',
  ],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) errors.push('tests AI-EXT fallaron');

if (errors.length) {
  console.error('ai-ext-inference-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ai-ext-inference-gate OK — ADR-005 Clinical Inference Gateway');
console.log('Cloud demo: AI_CLOUD_ENABLED=true OPENAI_API_KEY=... npm run dev:ai');
