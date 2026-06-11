#!/usr/bin/env node
/** MF-CM-05 — panel IA resumen + acciones sugeridas en contexto lateral. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panelPath = join(root, 'apps/web/src/components/chart/ClinicalRightContextPanel.tsx');
const panePath = join(root, 'apps/web/src/components/EpisClinicalContextPane.tsx');
const suggestionsPath = join(root, 'services/local-ai/src/contextPanelSuggestions.ts');

for (const [label, path] of [
  ['ClinicalRightContextPanel', panelPath],
  ['EpisClinicalContextPane', panePath],
  ['contextPanelSuggestions', suggestionsPath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

const panel = readFileSync(panelPath, 'utf8');
for (const needle of [
  'ClinicalContextPanelMetaContext',
  'epis2-context-panel-ai-status',
  'setAiAvailable',
]) {
  if (!panel.includes(needle)) errors.push(`ClinicalRightContextPanel falta ${needle}`);
}

const pane = readFileSync(panePath, 'utf8');
for (const needle of [
  'EpisClinicalContextAiSection',
  'buildContextPanelSuggestions',
  'epis2-context-ai-panel',
  'epis2-context-suggested-actions',
  'useClinicalCommandSubmit',
]) {
  if (!pane.includes(needle)) errors.push(`EpisClinicalContextPane falta ${needle}`);
}

const suggestions = readFileSync(suggestionsPath, 'utf8');
if (!suggestions.includes('buildContextPanelSuggestions')) {
  errors.push('contextPanelSuggestions incompleto');
}

if (!existsSync(join(root, 'reports/epis2-mf-cm-05-panel-ia.md'))) {
  errors.push('falta reports/epis2-mf-cm-05-panel-ia.md');
}

const vitest = spawnSync(
  'npx',
  [
    'vitest',
    'run',
    'services/local-ai/src/contextPanelSuggestions.test.ts',
    'apps/web/src/components/EpisClinicalContextPane.test.tsx',
  ],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) errors.push('tests panel IA fallaron');

if (errors.length) {
  console.error('cm-05-panel-ia-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('cm-05-panel-ia-gate OK — MF-CM-05');
