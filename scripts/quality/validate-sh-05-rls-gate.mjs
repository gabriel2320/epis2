#!/usr/bin/env node
/** MF-SH-05 — RLS staging runbook + EPIS2_RLS_FORCE + smoke C-4 documentado. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'docs/ops/RLS_STAGING_RUNBOOK.md',
  '.env.production.example',
  'database/migrations/022_epis2_rls_pilot.sql',
  'database/migrations/023_epis2_rls_force.sql',
  'reports/epis2-mf-sh-05-rls-runbook.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta: ${rel}`);
}

const runbook = readFileSync(join(root, 'docs/ops/RLS_STAGING_RUNBOOK.md'), 'utf8');
for (const token of [
  'EPIS2_RLS_FORCE',
  'epis2_app',
  'FORCE ROW LEVEL SECURITY',
  'C-4',
  'test:e2e:dual-chart',
  'hardening.rlsMode',
]) {
  if (!runbook.includes(token)) errors.push(`runbook sin ${token}`);
}

const prodEnv = readFileSync(join(root, '.env.production.example'), 'utf8');
for (const token of ['EPIS2_RLS_FORCE=1', 'RLS_MODE=enforce', 'epis2_app']) {
  if (!prodEnv.includes(token)) errors.push(`.env.production.example sin ${token}`);
}

function runVitest(label, paths) {
  const result = spawnSync('npx', ['vitest', 'run', ...paths], {
    cwd: root,
    shell: true,
    stdio: 'inherit',
  });
  if (result.status !== 0) errors.push(`${label} falló`);
}

runVitest('RLS migration + config tests', [
  'database/tests/migration-epis2-rls-force.test.mjs',
  'apps/api/src/config.test.ts',
]);

if (errors.length) {
  console.error('sh-05-rls-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('sh-05-rls-gate OK — MF-SH-05');
