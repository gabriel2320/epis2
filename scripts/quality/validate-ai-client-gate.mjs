#!/usr/bin/env node
/** MF-FF-11 — package @epis2/ai-client. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'packages/ai-client/package.json',
  'packages/ai-client/src/index.ts',
  'packages/ai-client/src/http.ts',
  'packages/ai-client/src/commandAssistDraft.ts',
  'packages/ai-client/src/contextPanelSuggestions.ts',
]) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const pkg = JSON.parse(readFileSync(join(root, 'packages/ai-client/package.json'), 'utf8'));
if (pkg.name !== '@epis2/ai-client') errors.push('package name debe ser @epis2/ai-client');

const aiApi = readFileSync(join(root, 'apps/web/src/api/aiApi.ts'), 'utf8');
if (!aiApi.includes('@epis2/ai-client/http')) {
  errors.push('apps/web/src/api/aiApi.ts debe usar @epis2/ai-client/http');
}

if (errors.length) {
  console.error('ai-client-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('ai-client-gate OK — MF-FF-11');
