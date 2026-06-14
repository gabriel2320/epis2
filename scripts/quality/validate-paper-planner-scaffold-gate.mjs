#!/usr/bin/env node
/** MF-PAPER-PLANNER-00 — ADR-003 + DailyClinicalPage scaffold. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const adrPath = join(root, 'docs/adr/ADR-003-paper-planner-mode.md');
const dayPath = join(root, 'apps/web/src/components/chart/paper/planner/DailyClinicalPage.tsx');
const shellPath = join(root, 'apps/web/src/components/chart/paper/planner/PaperPlannerShell.tsx');
const modePath = join(root, 'apps/web/src/components/chart/PaperChartMode.tsx');

for (const [label, path] of [
  ['ADR-003', adrPath],
  ['DailyClinicalPage', dayPath],
  ['PaperPlannerShell', shellPath],
  ['PaperChartMode', modePath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

if (existsSync(modePath)) {
  const src = readFileSync(modePath, 'utf8');
  for (const needle of ['PaperPlannerSurfaceTabs', 'PaperPlannerShell', 'paperSurface']) {
    if (!src.includes(needle)) errors.push(`PaperChartMode falta ${needle}`);
  }
}

if (existsSync(dayPath)) {
  const src = readFileSync(dayPath, 'utf8');
  for (const needle of [
    'epis2-paper-planner-day',
    'epis2-paper-planner-timeline',
    'DEMO_PLANNER',
  ]) {
    if (!src.includes(needle)) errors.push(`DailyClinicalPage falta ${needle}`);
  }
}

const vitest = spawnSync(
  'npx',
  ['vitest', 'run', 'apps/web/src/components/chart/paper/planner/DailyClinicalPage.test.tsx'],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) {
  errors.push('DailyClinicalPage.test.tsx falló');
}

if (errors.length) {
  console.error('paper-planner-scaffold-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('paper-planner-scaffold-gate OK — MF-PAPER-PLANNER-00');
