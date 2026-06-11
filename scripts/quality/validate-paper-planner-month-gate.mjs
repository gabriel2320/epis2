#!/usr/bin/env node
/** MF-PAPER-PLANNER-02 — vista mensual + markers. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'apps/web/src/components/chart/paper/planner/monthLayout.ts',
  'apps/web/src/components/chart/paper/planner/MonthlyClinicalPage.tsx',
  'apps/web/src/components/chart/paper/planner/demoMonthData.ts',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta: ${rel}`);
}

const shellSrc = readFileSync(
  join(root, 'apps/web/src/components/chart/paper/planner/PaperPlannerShell.tsx'),
  'utf8',
);
if (!shellSrc.includes('MonthlyClinicalPage')) {
  errors.push('PaperPlannerShell sin MonthlyClinicalPage');
}

const layoutSrc = readFileSync(
  join(root, 'apps/web/src/components/chart/paper/planner/monthLayout.ts'),
  'utf8',
);
for (const needle of ['layoutMonthGrid', 'MonthMarker', 'weeks']) {
  if (!layoutSrc.includes(needle)) errors.push(`monthLayout falta ${needle}`);
}

const vitest = spawnSync(
  'npx',
  [
    'vitest',
    'run',
    'apps/web/src/components/chart/paper/planner/monthLayout.test.ts',
    'apps/web/src/components/chart/paper/planner/MonthlyClinicalPage.test.tsx',
  ],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) errors.push('tests vista mensual fallaron');

if (errors.length) {
  console.error('paper-planner-month-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('paper-planner-month-gate OK — MF-PAPER-PLANNER-02');
