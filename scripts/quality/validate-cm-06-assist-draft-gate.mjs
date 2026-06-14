#!/usr/bin/env node
/** MF-CM-06 — assist borrador invocable desde barra de comando. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const hookPath = join(root, 'apps/web/src/clinical/useClinicalCommandSubmit.ts');
const formAssistPath = join(
  root,
  'apps/web/src/clinical/generated-form/useGeneratedFormAiAssist.ts',
);
const assistPath = join(root, 'services/local-ai/src/commandAssistDraft.ts');
const apiRoutesPath = join(root, 'apps/api/src/ai/routes.ts');

for (const [label, path] of [
  ['useClinicalCommandSubmit', hookPath],
  ['useGeneratedFormAiAssist', formAssistPath],
  ['commandAssistDraft', assistPath],
  ['ai routes', apiRoutesPath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

const hook = readFileSync(hookPath, 'utf8');
for (const needle of [
  'navigateResolvedWithAssistDraft',
  'requestDraftAssist',
  'stashCommandAssistDraft',
  'assistDraft: true',
  "source: 'command_bar'",
]) {
  if (!hook.includes(needle)) errors.push(`useClinicalCommandSubmit falta ${needle}`);
}

const formAssist = readFileSync(formAssistPath, 'utf8');
if (!formAssist.includes('consumeCommandAssistDraft') || !formAssist.includes('assistDraft')) {
  errors.push('useGeneratedFormAiAssist debe aplicar borrador de comando');
}

const apiRoutes = readFileSync(apiRoutesPath, 'utf8');
if (!apiRoutes.includes('assistOrigin')) {
  errors.push('ai routes debe trazar assistOrigin command_bar en ai_runs');
}

if (!existsSync(join(root, 'reports/epis2-mf-cm-06-assist-draft.md'))) {
  errors.push('falta reports/epis2-mf-cm-06-assist-draft.md');
}

const vitest = spawnSync(
  'npx',
  [
    'vitest',
    'run',
    'services/local-ai/src/commandAssistDraft.test.ts',
    'apps/web/src/clinical/useClinicalCommandSubmit.test.ts',
    'apps/api/src/ai/routes.test.ts',
  ],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) errors.push('tests CM-06 fallaron');

if (errors.length) {
  console.error('cm-06-assist-draft-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('cm-06-assist-draft-gate OK — MF-CM-06 (live: npm run ai:evals:live con dev:ai)');
console.log('Evidencia Ollama: npm run stack:dev && npm run dev:ai && npm run ai:evals:live');
