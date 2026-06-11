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

const vitest = spawnSync(
  'npx',
  ['vitest', 'run', 'packages/command-registry/src/paper-planner-commands.test.ts'],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) errors.push('paper-planner-commands.test falló');

if (errors.length) {
  console.error('paper-planner-ai-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('paper-planner-ai-gate OK — MF-PAPER-PLANNER-04');
