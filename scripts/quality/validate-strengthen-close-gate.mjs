#!/usr/bin/env node
/**
 * Cierre PROG-STRENGTHEN-2026 (23/23 MF).
 *   npm run quality:strengthen-close-gate
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'reports/epis2-prog-strengthen-close-2026.md',
  'reports/epis2-mf-ic-04-hl7-quarantine-hardening.md',
  'docs/ops/HL7_INTEROP_INGESTION_RUNBOOK.md',
  'database/tests/migration-hl7-quarantine.test.mjs',
  'apps/api/src/interop/hl7.integration.test.ts',
  'database/migrations/031_hl7_quarantine.sql',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const ledger = JSON.parse(readFileSync(join(root, 'docs/quality/strengthen-ledger.json'), 'utf8'));
const phases = ledger.phases ?? [];
const done = phases.filter((p) => p.state === 'DONE');
if (done.length !== phases.length) {
  errors.push(
    `strengthen-ledger: ${done.length}/${phases.length} DONE (esperado ${phases.length}/${phases.length})`,
  );
}
if (ledger.executionStatus !== 'CLOSED') {
  errors.push(
    `strengthen-ledger.executionStatus debe ser CLOSED (actual: ${ledger.executionStatus})`,
  );
}
const ic04 = phases.find((p) => p.id === 'MF-IC-04');
if (!ic04 || ic04.state !== 'DONE') {
  errors.push('MF-IC-04 debe estar DONE');
}

function runGate(label, cmd, args) {
  const result = spawnSync(cmd, args, { cwd: root, shell: true, encoding: 'utf8', stdio: 'pipe' });
  if (result.status !== 0) {
    errors.push(`${label} falló`);
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }
}

runGate('db:validate', 'npm', ['run', 'db:validate']);
runGate('migration-hl7-quarantine tests', 'npx', [
  'vitest',
  'run',
  'database/tests/migration-hl7-quarantine.test.mjs',
]);
runGate('quality:interop-chile-gate', 'npm', ['run', 'quality:interop-chile-gate']);
runGate('quality:cds-hooks-gate', 'npm', ['run', 'quality:cds-hooks-gate']);

if (errors.length) {
  console.error('quality:strengthen-close-gate — FALLO');
  for (const e of errors) console.error(`  · ${e}`);
  process.exit(1);
}

console.log('quality:strengthen-close-gate — OK (PROG-STRENGTHEN 23/23 cerrado)');
