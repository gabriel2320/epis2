#!/usr/bin/env node
/** MF-PAPER-08 — comandos IA paper en command-registry. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const paths = {
  paperCommands: join(root, 'packages/command-registry/src/paper-commands.ts'),
  paperTest: join(root, 'packages/command-registry/src/paper-commands.test.ts'),
  contextPanel: join(root, 'apps/web/src/components/chart/ClinicalRightContextPanel.tsx'),
  definitions: join(root, 'packages/command-registry/src/definitions.ts'),
};

for (const [label, path] of Object.entries(paths)) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

if (existsSync(paths.paperCommands)) {
  const src = readFileSync(paths.paperCommands, 'utf8');
  for (const needle of [
    'paper_order_soap',
    'paper_detect_pending',
    'paper_prepare_print',
    'getPaperChartCommandSuggestions',
  ]) {
    if (!src.includes(needle)) errors.push(`paper-commands.ts falta ${needle}`);
  }
}

if (existsSync(paths.contextPanel)) {
  const src = readFileSync(paths.contextPanel, 'utf8');
  if (!src.includes('epis2-paper-ai-drafts-panel')) {
    errors.push('ClinicalRightContextPanel falta epis2-paper-ai-drafts-panel');
  }
}

if (existsSync(paths.definitions)) {
  const src = readFileSync(paths.definitions, 'utf8');
  if (!src.includes('PAPER_CHART_COMMAND_DEFINITIONS')) {
    errors.push('definitions.ts no incluye PAPER_CHART_COMMAND_DEFINITIONS');
  }
}

if (errors.length) {
  console.error('paper-mode-ai-commands-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('paper-mode-ai-commands-gate OK — MF-PAPER-08 comandos papel');
