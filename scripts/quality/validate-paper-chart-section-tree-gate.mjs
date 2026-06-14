#!/usr/bin/env node
/** Árbol canónico ficha papel I–XIV — schema + navegación reconciliada. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const build = spawnSync('npm', ['run', 'build', '-w', '@epis2/clinical-forms'], {
  cwd: root,
  shell: true,
  stdio: 'inherit',
});
if (build.status !== 0) {
  errors.push('build @epis2/clinical-forms falló');
}

const treePath = join(root, 'packages/clinical-forms/src/paper-chart/paperChartSectionTree.ts');
const navPath = join(root, 'apps/web/src/navigation/paperChartNavigationTree.ts');
const docPath = join(root, 'docs/architecture/EPIS2_PAPER_CHART_SECTION_TREE.md');

for (const [label, path] of [
  ['paperChartSectionTree', treePath],
  ['paperChartNavigationTree', navPath],
  ['EPIS2_PAPER_CHART_SECTION_TREE doc', docPath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

if (existsSync(treePath)) {
  const src = readFileSync(treePath, 'utf8');
  for (const needle of [
    'EPIS2_PAPER_CHART_SECTION_TREE',
    'PAPER_CHART_SECTION_ROMAN',
    'socialWork',
    'assertPaperChartSectionTreeInvariants',
  ]) {
    if (!src.includes(needle)) errors.push(`paperChartSectionTree falta ${needle}`);
  }
}

if (existsSync(navPath)) {
  const src = readFileSync(navPath, 'utf8');
  for (const needle of [
    'EPIS2_DUAL_CHART_MODE_SURFACES',
    'EPIS2_PAPER_CHART_SECTION_SURFACES',
    'chartMode=paper',
    'assertPaperChartNavigationTreeInvariants',
  ]) {
    if (!src.includes(needle)) errors.push(`paperChartNavigationTree falta ${needle}`);
  }
}

const vitest = spawnSync(
  'npx',
  [
    'vitest',
    'run',
    'packages/clinical-forms/src/paper-chart/paperChartSectionTree.test.ts',
    'apps/web/src/navigation/paperChartNavigationTree.test.ts',
  ],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) {
  errors.push('tests árbol papel fallaron');
}

if (errors.length) {
  console.error(
    'paper-chart-section-tree-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('paper-chart-section-tree-gate OK — árbol I–XIV reconciliado');
