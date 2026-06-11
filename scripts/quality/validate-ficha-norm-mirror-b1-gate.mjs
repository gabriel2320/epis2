#!/usr/bin/env node
/** MF-NORM-09 — espejo batch 1 alergias…evolución. */
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

const strip = readFileSync(
  join(root, 'apps/web/src/components/chart/sections/TraditionalSectionMirrorStrip.tsx'),
  'utf8',
);
if (!strip.includes('getMirrorBindingForTraditionalSection')) {
  errors.push('TraditionalSectionMirrorStrip debe usar mirror bindings');
}

const resolver = readFileSync(
  join(root, 'apps/web/src/components/chart/sections/index.tsx'),
  'utf8',
);
if (!resolver.includes('isChartMirrorBatch1Section')) {
  errors.push('resolveTraditionalSectionContent debe aplicar espejo batch1');
}

if (!existsSync(join(root, 'reports/epis2-mf-norm-09-sections-b1.md'))) {
  errors.push('falta reports/epis2-mf-norm-09-sections-b1.md');
}

if (errors.length) {
  console.error('ficha-norm-mirror-b1-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ficha-norm-mirror-b1-gate OK — MF-NORM-09');
