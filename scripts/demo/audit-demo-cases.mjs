#!/usr/bin/env node
/** MF-NORM-06 — audit casos demo + secciones ficha dual. */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const vitest = spawnSync(
  'npx',
  [
    'vitest',
    'run',
    'packages/test-fixtures/src/demoCases.test.ts',
    'packages/test-fixtures/src/demoNarratives.test.ts',
    'packages/test-fixtures/src/demoChartSections.test.ts',
  ],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) errors.push('tests demo fixtures fallaron');

if (errors.length) {
  console.error('audit-demo-cases FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('audit-demo-cases OK — MF-NORM-06');
