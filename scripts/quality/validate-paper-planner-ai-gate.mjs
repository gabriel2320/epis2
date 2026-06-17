#!/usr/bin/env node
/** MF-PAPER-PLANNER-04 — comandos IA contextuales planner. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const cmdPath = join(root, 'packages/command-registry/src/paper-planner-commands.ts');
if (!existsSync(cmdPath)) errors.push('falta paper-planner-commands.ts');

if (existsSync(cmdPath)) {
  const src = readFileSync(cmdPath, 'utf8');
  for (const needle of [
    'paper_planner_summarize_day',
    'paper_planner_print_agenda',
    'paper_planner_review_pending',
    'paperPlannerIntentBoost',
  ]) {
    if (!src.includes(needle)) errors.push(`paper-planner-commands falta ${needle}`);
  }
}

const defs = readFileSync(join(root, 'packages/command-registry/src/definitions.ts'), 'utf8');
if (!defs.includes('PAPER_PLANNER_COMMAND_DEFINITIONS')) {
  errors.push('definitions.ts sin PAPER_PLANNER_COMMAND_DEFINITIONS');
}

const rank = readFileSync(join(root, 'packages/command-registry/src/context-rank.ts'), 'utf8');
if (!rank.includes('paperPlannerIntentBoost')) {
  errors.push('context-rank sin paperPlannerIntentBoost');
}

const hintsPath = join(
  root,
  'apps/web/src/components/chart/paper/planner/PaperPlannerCommandHints.tsx',
);
const shellPath = join(root, 'apps/web/src/components/chart/paper/planner/PaperPlannerShell.tsx');
const hookPath = join(
  root,
  'apps/web/src/components/chart/paper/planner/usePaperPlannerCommands.ts',
);

for (const [label, path] of [
  ['PaperPlannerCommandHints', hintsPath],
  ['usePaperPlannerCommands', hookPath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

if (existsSync(shellPath)) {
  const src = readFileSync(shellPath, 'utf8');
  for (const needle of ['PaperPlannerCommandHints', 'usePaperPlannerCommands']) {
    if (!src.includes(needle)) errors.push(`PaperPlannerShell falta ${needle}`);
  }
}

if (existsSync(hintsPath)) {
  const src = readFileSync(hintsPath, 'utf8');
  if (!src.includes('epis2-paper-planner-command-hints')) {
    errors.push('PaperPlannerCommandHints sin testid principal');
  }
}

if (!existsSync(join(root, 'reports/archive/2026-06/epis2-mf-pa-07-planner-ai.md'))) {
  errors.push('falta reports/archive/2026-06/epis2-mf-pa-07-planner-ai.md');
}

const vitest = spawnSync(
  'npx',
  [
    'vitest',
    'run',
    'packages/command-registry/src/paper-planner-commands.test.ts',
    'apps/web/src/components/chart/paper/planner/PaperPlannerCommandHints.test.tsx',
  ],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) errors.push('paper-planner-commands.test falló');

if (errors.length) {
  console.error('paper-planner-ai-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('paper-planner-ai-gate OK — MF-PAPER-PLANNER-04');
