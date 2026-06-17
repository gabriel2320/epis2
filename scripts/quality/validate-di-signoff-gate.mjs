#!/usr/bin/env node
/** MF-DI-10 — Signoff PROG-DETERMINISTIC-INTELLIGENCE-2026. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const ledger = JSON.parse(readFileSync(join(root, 'docs/quality/di-ledger.json'), 'utf8'));

for (const id of [
  'MF-DI-01',
  'MF-DI-02',
  'MF-DI-03',
  'MF-DI-04',
  'MF-DI-05',
  'MF-DI-06',
  'MF-DI-07',
  'MF-DI-08',
  'MF-DI-09',
]) {
  const mf = ledger.phases.find((p) => p.id === id);
  if (!mf) {
    errors.push(`ledger sin ${id}`);
    continue;
  }
  if (mf.state !== 'DONE') {
    errors.push(`${id} debe estar DONE (actual: ${mf.state})`);
  }
}

const requiredDocs = [
  'docs/quality/DI_CLINICAL_SECRETARY_SIGNOFF_CHECKLIST.md',
  'reports/archive/2026-06/epis2-prog-di-close-2026.md',
  'e2e/di-clinical-secretary-journey.spec.ts',
];

for (const rel of requiredDocs) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const e2e = readFileSync(join(root, 'e2e/di-clinical-secretary-journey.spec.ts'), 'utf8');
for (const token of [
  'epis2-clinical-context-dense-strip',
  'epis2-command-prefill-badge',
  'epis2-post-save-microjourneys',
  'epis2-clinical-filterable-timeline',
  'DEMO-002',
]) {
  if (!e2e.includes(token)) errors.push(`di-clinical-secretary-journey.spec.ts sin ${token}`);
}

const DI_SUB_GATES = [
  'validate-di-context-gate.mjs',
  'validate-di-memory-gate.mjs',
  'validate-di-autocomplete-gate.mjs',
  'validate-di-prefill-gate.mjs',
  'validate-di-suggestions-gate.mjs',
  'validate-di-templates-gate.mjs',
  'validate-di-timeline-gate.mjs',
  'validate-di-journeys-gate.mjs',
];

for (const script of DI_SUB_GATES) {
  const path = join(root, 'scripts/quality', script);
  if (!existsSync(path)) {
    errors.push(`falta gate ${script}`);
    continue;
  }
  const result = spawnSync(process.execPath, [path], {
    stdio: 'pipe',
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    errors.push(`${script} falló`);
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }
}

if (errors.length) {
  console.error('quality:di-signoff-gate — FALLO');
  for (const e of errors) console.error(`  · ${e}`);
  process.exit(1);
}

console.log('quality:di-signoff-gate — OK (MF-DI-10 / PROG-DI-CLOSE)');
