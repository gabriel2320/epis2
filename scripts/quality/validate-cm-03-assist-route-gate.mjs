#!/usr/bin/env node
/** MF-CM-03 — assist-route + hint IA visible en barra. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const assistPath = join(root, 'packages/command-registry/src/assist-route.ts');
const commandPage = join(root, 'apps/web/src/pages/CommandCenterPage.tsx');
const fichaPanel = join(root, 'apps/web/src/components/PatientWorkspaceCommandPanel.tsx');

for (const [label, path] of [
  ['assist-route', assistPath],
  ['CommandCenterPage', commandPage],
  ['PatientWorkspaceCommandPanel', fichaPanel],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

const assist = readFileSync(assistPath, 'utf8');
for (const needle of ['pickAssistFallback', 'getCommandBarAiHint', 'assistClarifyFooterHint']) {
  if (!assist.includes(needle)) errors.push(`assist-route falta ${needle}`);
}

const cc = readFileSync(commandPage, 'utf8');
if (!cc.includes('getCommandBarAiHint') || !cc.includes('epis2-command-center-ai-hint')) {
  errors.push('CommandCenterPage debe exponer aiHint en barra');
}
if (!cc.includes('epis2-command-clarify-assist')) {
  errors.push('CommandCenterPage debe mostrar hint clarify assist-route');
}

const ficha = readFileSync(fichaPanel, 'utf8');
if (!ficha.includes('getCommandBarAiHint') || !ficha.includes('epis2-ficha-command-ai-hint')) {
  errors.push('PatientWorkspaceCommandPanel debe exponer aiHint');
}

if (!existsSync(join(root, 'reports/epis2-mf-cm-03-assist-route.md'))) {
  errors.push('falta reports/epis2-mf-cm-03-assist-route.md');
}

const vitest = spawnSync(
  'npx',
  [
    'vitest',
    'run',
    'packages/command-registry/src/assist-route.test.ts',
    'packages/command-registry/src/chips.test.ts',
  ],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) errors.push('tests assist-route/chips fallaron');

if (errors.length) {
  console.error('cm-03-assist-route-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('cm-03-assist-route-gate OK — MF-CM-03 (live: npm run ai:evals:live con dev:ai)');
