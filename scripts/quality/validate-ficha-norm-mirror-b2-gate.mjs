#!/usr/bin/env node
/** MF-NORM-10 — espejo batch 2 + ocultar nav vacías demo. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const vitest = spawnSync(
  'npx',
  ['vitest', 'run', 'packages/clinical-forms/src/chart-section-mirror.test.ts'],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) errors.push('chart-section-mirror tests fallaron');

const mirror = readFileSync(
  join(root, 'packages/clinical-forms/src/chart-section-mirror.ts'),
  'utf8',
);
if (!mirror.includes('CHART_MIRROR_BATCH2_NAV_IDS')) {
  errors.push('falta CHART_MIRROR_BATCH2_NAV_IDS');
}

const resolver = readFileSync(
  join(root, 'apps/web/src/components/chart/sections/index.tsx'),
  'utf8',
);
if (!resolver.includes('isChartMirrorBatchSection')) {
  errors.push('resolveTraditionalSectionContent debe aplicar espejo batch1+2');
}

const nav = readFileSync(
  join(root, 'apps/web/src/components/chart/TraditionalSectionNav.tsx'),
  'utf8',
);
if (!nav.includes('visibleSectionIds')) {
  errors.push('TraditionalSectionNav debe filtrar visibleSectionIds');
}

const visibility = readFileSync(
  join(root, 'apps/web/src/components/chart/traditionalSectionVisibility.ts'),
  'utf8',
);
if (!visibility.includes('hasDemoTraditionalSectionContent')) {
  errors.push('traditionalSectionVisibility debe usar hasDemoTraditionalSectionContent');
}

if (!existsSync(join(root, 'reports/epis2-mf-norm-10-sections-b2.md'))) {
  errors.push('falta reports/epis2-mf-norm-10-sections-b2.md');
}

if (errors.length) {
  console.error('ficha-norm-mirror-b2-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ficha-norm-mirror-b2-gate OK — MF-NORM-10');
