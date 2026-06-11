#!/usr/bin/env node
/** MF-PAPER-PLANNER-01 — vista semanal + algoritmos layout. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const weekPath = join(root, 'apps/web/src/components/chart/paper/planner/WeeklyClinicalPage.tsx');
const layoutPath = join(root, 'apps/web/src/components/chart/paper/planner/weekLayout.ts');
const shellPath = join(root, 'apps/web/src/components/chart/paper/planner/PaperPlannerShell.tsx');

for (const [label, path] of [
  ['WeeklyClinicalPage', weekPath],
  ['weekLayout', layoutPath],
  ['PaperPlannerShell', shellPath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

if (existsSync(layoutPath)) {
  const src = readFileSync(layoutPath, 'utf8');
  for (const needle of ['layoutWeekGrid', 'PLANNER_WEEK_MAX_ITEMS_PER_DAY', 'overflowCount']) {
    if (!src.includes(needle)) errors.push(`weekLayout falta ${needle}`);
  }
}

if (existsSync(weekPath)) {
  const src = readFileSync(weekPath, 'utf8');
  if (!src.includes('epis2-paper-planner-week-grid')) {
    errors.push('WeeklyClinicalPage falta grid semanal');
  }
}

if (existsSync(shellPath)) {
  const src = readFileSync(shellPath, 'utf8');
  if (!src.includes('WeeklyClinicalPage')) {
    errors.push('PaperPlannerShell no integra WeeklyClinicalPage');
  }
}

const vitest = spawnSync(
  'npx',
  [
    'vitest',
    'run',
    'apps/web/src/components/chart/paper/planner/weekLayout.test.ts',
    'apps/web/src/components/chart/paper/planner/WeeklyClinicalPage.test.tsx',
  ],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) {
  errors.push('tests vista semanal fallaron');
}

if (errors.length) {
  console.error('paper-planner-week-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('paper-planner-week-gate OK — MF-PAPER-PLANNER-01');
