#!/usr/bin/env node
/** Semana 4+ — orquestación subagentes + Ollama dev assist + brief unificado. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const requiredScripts = [
  'scripts/dev-agent/session.mjs',
  'scripts/dev-agent/brief.mjs',
  'scripts/dev-agent/context.mjs',
  'scripts/dev-agent/close.mjs',
  'scripts/dev-agent/orchestrate.mjs',
  'scripts/dev-agent/ollama-assist.mjs',
  'scripts/dev-agent/ollama-write.mjs',
  'scripts/dev-agent/ollama-automation.mjs',
  'scripts/ollama/native-client.mjs',
  'scripts/ollama/probe.mjs',
  'scripts/dev-agent/low-risk-policy.mjs',
  'scripts/dev-agent/subagents.mjs',
  'scripts/dev-agent/schemas.mjs',
  'scripts/dev-agent-tramo-prompt.mjs',
];

for (const rel of requiredScripts) {
  if (!existsSync(join(root, rel))) errors.push(`falta ${rel}`);
}

const aiDoc = join(root, 'docs/product/EPIS2_AI_ASSISTED_DEV.md');
const doc = join(root, 'docs/product/EPIS2_DEV_AGENT_ORCHESTRATION.md');
const subDoc = join(root, 'docs/product/EPIS2_DEV_SUBAGENTS.md');
const cursorRule = join(root, '.cursor/rules/90-ai-assisted-dev.mdc');

for (const [label, path] of [
  ['EPIS2_AI_ASSISTED_DEV', aiDoc],
  ['EPIS2_DEV_AGENT_ORCHESTRATION', doc],
  ['EPIS2_DEV_SUBAGENTS', subDoc],
  ['90-ai-assisted-dev', cursorRule],
]) {
  if (!existsSync(path)) errors.push(`falta ${label}`);
}

const aiText = existsSync(aiDoc) ? readFileSync(aiDoc, 'utf8') : '';
if (!aiText.includes('dev:session')) errors.push('EPIS2_AI_ASSISTED_DEV sin dev:session');

const text = existsSync(doc) ? readFileSync(doc, 'utf8') : '';
if (!text.includes('dev:agent:ollama')) errors.push('orquestación sin Ollama dev assist');

const subText = existsSync(subDoc) ? readFileSync(subDoc, 'utf8') : '';
for (const id of ['golden-guardian', 'layers-integrator', 'ollama-clinical', 'ollama-dev-writer', 'gate-runner']) {
  if (!subText.includes(id)) errors.push(`EPIS2_DEV_SUBAGENTS sin ${id}`);
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
for (const npm of [
  'dev:session',
  'dev:agent:orchestrate',
  'dev:agent:ollama',
  'dev:agent:ollama-write',
  'dev:agent:ollama-auto',
  'ollama:probe',
  'ollama:route',
  'quality:dev-agent-ollama-automation-gate',
  'dev:agent:close',
  'dev:agent:tramo-k',
  'dev:agent:subagent',
  'quality:dev-agent-low-risk-write-gate',
]) {
  if (!pkg.includes(`"${npm}"`)) errors.push(`package.json sin ${npm}`);
}

const schema = readFileSync(join(root, 'scripts/dev-agent/schemas.mjs'), 'utf8');
if (!schema.includes('requiresHumanReview: z.literal(true)')) {
  errors.push('dev assist schema debe exigir requiresHumanReview');
}

const brief = readFileSync(join(root, 'scripts/dev-agent/brief.mjs'), 'utf8');
if (!brief.includes('buildDevBrief')) errors.push('brief.mjs incompleto');

if (errors.length) {
  console.error('dev-agent-orchestration-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('dev-agent-orchestration-gate OK — sesión IA + subagentes + brief integrados');
