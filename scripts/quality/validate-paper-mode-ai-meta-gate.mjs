#!/usr/bin/env node
/** MF-PAPER-03 — metadatos IA + validación firma paper chart. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const schemaPath = join(root, 'packages/clinical-forms/src/paper-chart/schema.ts');
const aiPath = join(root, 'packages/clinical-forms/src/paper-chart/paperAiState.ts');
const hookPath = join(root, 'apps/web/src/clinical/usePaperChartDraft.ts');

for (const [label, path] of [
  ['schema', schemaPath],
  ['paperAiState', aiPath],
  ['usePaperChartDraft', hookPath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

if (existsSync(schemaPath)) {
  const src = readFileSync(schemaPath, 'utf8');
  for (const needle of [
    'paperFieldStateSchema',
    'canSignPaperChart',
    'applyPaperChartSectionPatch',
  ]) {
    if (!src.includes(needle)) errors.push(`schema.ts falta ${needle}`);
  }
}

if (existsSync(aiPath)) {
  const src = readFileSync(aiPath, 'utf8');
  for (const needle of ['insertAiSuggestion', 'confirmAiSuggestion']) {
    if (!src.includes(needle)) errors.push(`paperAiState.ts falta ${needle}`);
  }
}

if (existsSync(hookPath)) {
  const src = readFileSync(hookPath, 'utf8');
  for (const needle of ['canSign', 'confirmSection', 'signBlockMessage']) {
    if (!src.includes(needle)) errors.push(`usePaperChartDraft falta ${needle}`);
  }
}

if (errors.length) {
  console.error('paper-mode-ai-meta-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('paper-mode-ai-meta-gate OK — MF-PAPER-03 IA meta + firma');
