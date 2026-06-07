#!/usr/bin/env node
/** Semana 4 — orquestación agente SDK (prompt tramo). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

if (!existsSync(join(root, 'scripts/dev-agent-tramo-prompt.mjs'))) {
  errors.push('falta dev-agent-tramo-prompt.mjs');
}

const doc = join(root, 'docs/product/EPIS2_DEV_AGENT_ORCHESTRATION.md');
if (!existsSync(doc)) errors.push('falta EPIS2_DEV_AGENT_ORCHESTRATION.md');

const text = existsSync(doc) ? readFileSync(doc, 'utf8') : '';
if (!text.includes('@cursor/sdk')) errors.push('orquestación sin referencia @cursor/sdk');
if (!text.includes('dev:agent:tramo-k') && !text.includes('dev-agent-tramo-prompt')) {
  errors.push('orquestación sin comando prompt tramo');
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
if (!pkg.includes('"dev:agent:tramo-k"')) errors.push('package.json sin dev:agent:tramo-k');

if (errors.length) {
  console.error('dev-agent-orchestration-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('dev-agent-orchestration-gate OK — prompt agente tramo K registrado');
