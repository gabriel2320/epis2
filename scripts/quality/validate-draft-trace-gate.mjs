#!/usr/bin/env node
/** MF-SH-01 — trazabilidad draft→approve→ai_runs. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const migration = join(root, 'database/migrations/043_approvals_ai_run.sql');
const schemaPath = join(root, 'apps/api/src/db/schema.ts');
const tracePath = join(root, 'packages/contracts/src/approvalTrace.ts');
const servicePath = join(root, 'apps/api/src/clinical/service.ts');

for (const [label, path] of [
  ['migration 043', migration],
  ['approvalTrace', tracePath],
  ['clinical service', servicePath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

const schema = readFileSync(schemaPath, 'utf8');
if (!schema.includes('aiRunId') || !schema.includes('ai_run_id')) {
  errors.push('schema approvals debe incluir aiRunId');
}

const service = readFileSync(servicePath, 'utf8');
for (const needle of [
  'readAssistTraceFromDraftBody',
  'stripAssistTraceFromDraftBody',
  'assistTrace?.aiRunId',
  'payload: {',
]) {
  if (!service.includes(needle)) errors.push(`service.ts falta ${needle}`);
}

if (!existsSync(join(root, 'reports/epis2-mf-sh-01-draft-trace.md'))) {
  errors.push('falta reports/epis2-mf-sh-01-draft-trace.md');
}

const vitest = spawnSync(
  'npx',
  [
    'vitest',
    'run',
    'packages/contracts/src/approvalTrace.test.ts',
    'apps/api/src/clinical/draft-trace.integration.test.ts',
  ],
  { cwd: root, shell: true, stdio: 'inherit', env: { ...process.env } },
);
if (vitest.status !== 0) errors.push('tests draft-trace fallaron');

if (errors.length) {
  console.error('draft-trace-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('draft-trace-gate OK — MF-SH-01');
