#!/usr/bin/env node
/** Dev agent — automatización Ollama nativa (probe → plan → write L0). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'scripts/ollama/native-client.mjs',
  'scripts/ollama/probe.mjs',
  'scripts/ollama/native-client.test.mjs',
  'scripts/dev-agent/ollama-automation.mjs',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta ${rel}`);
}

const native = readFileSync(join(root, 'scripts/ollama/native-client.mjs'), 'utf8');
for (const token of ['probeOllamaNative', 'ensureOllamaReady', 'getOllamaStatus', 'getOllamaEnv']) {
  if (!native.includes(token)) errors.push(`native-client sin ${token}`);
}

const automation = readFileSync(join(root, 'scripts/dev-agent/ollama-automation.mjs'), 'utf8');
for (const token of ['ensureOllamaReady', 'ollama-assist.mjs', 'ollama-write.mjs', 'dev-agent-ollama-automation.json']) {
  if (!automation.includes(token)) errors.push(`ollama-automation sin ${token}`);
}

const session = readFileSync(join(root, 'scripts/dev-agent/session.mjs'), 'utf8');
if (!session.includes('--ollama-auto')) errors.push('session.mjs sin --ollama-auto');

const assist = readFileSync(join(root, 'scripts/dev-agent/ollama-assist.mjs'), 'utf8');
if (!assist.includes('ensureOllamaReady')) errors.push('ollama-assist sin ensureOllamaReady');

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
for (const npm of ['dev:agent:ollama-auto', 'ollama:probe', 'quality:dev-agent-ollama-automation-gate']) {
  if (!pkg.includes(`"${npm}"`)) errors.push(`package.json sin ${npm}`);
}

const aiDoc = readFileSync(join(root, 'docs/product/EPIS2_AI_ASSISTED_DEV.md'), 'utf8');
if (!aiDoc.includes('dev:agent:ollama-auto')) {
  errors.push('EPIS2_AI_ASSISTED_DEV sin dev:agent:ollama-auto');
}
if (!existsSync(join(root, 'scripts/ollama/pull-coder-models.mjs'))) {
  errors.push('falta scripts/ollama/pull-coder-models.mjs');
}
if (!pkg.includes('ai:pull-coder-models')) {
  errors.push('package.json sin ai:pull-coder-models');
}
for (const rel of [
  'scripts/ollama/model-router.mjs',
  'scripts/ollama/workstation-profile.mjs',
  'scripts/ollama/route.mjs',
  'scripts/ollama/model-router.test.mjs',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta ${rel}`);
}
const router = readFileSync(join(root, 'scripts/ollama/model-router.mjs'), 'utf8');
for (const token of ['resolveOllamaRoute', 'pickModelForFunction', 'dev-plan', 'dev-write']) {
  if (!router.includes(token)) errors.push(`model-router sin ${token}`);
}
if (!pkg.includes('ollama:route')) errors.push('package.json sin ollama:route');

if (errors.length) {
  console.error('dev-agent-ollama-automation-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('dev-agent-ollama-automation-gate OK — probe nativo + pipeline ollama-auto integrados');
