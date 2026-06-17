#!/usr/bin/env node
/**
 * MF-CASE-11: signoff programa clinical-case-intel (MF-CASE-01…10).
 * Uso: npm run quality:case-intel-closure-gate
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const requiredPaths = [
  'services/clinical-case-intel/src/cli.ts',
  'services/clinical-case-intel/fixtures/catalog.json',
  'packages/contracts/src/clinicalCaseIntel.ts',
  'packages/test-fixtures/src/simCases.ts',
  'packages/test-fixtures/src/simAssistEvals.ts',
  'database/migrations/041_clinical_case_staging.sql',
  'database/migrations/042_sim_clinical_cases_seed.sql',
  'apps/api/src/admin/clinicalCasePromote.ts',
  'scripts/ai-evals-sim-live.mjs',
  'reports/archive/2026-06/epis2-mf-case-clinical-case-intel.md',
];

for (const rel of requiredPaths) {
  if (!existsSync(join(root, rel))) {
    errors.push(`artefacto ausente: ${rel}`);
  }
}

const reportPath = join(root, 'reports/archive/2026-06/epis2-mf-case-clinical-case-intel.md');
if (existsSync(reportPath)) {
  const report = readFileSync(reportPath, 'utf8');
  for (const tag of ['MF-CASE-09', 'MF-CASE-10']) {
    if (!report.includes(tag)) errors.push(`reporte sin sección ${tag}`);
  }
}

const goldenPath = join(root, 'tests/golden-clinical-journey.api.spec.ts');
if (existsSync(goldenPath)) {
  const golden = readFileSync(goldenPath, 'utf8');
  for (const tag of ['golden-v6-sim-assist', 'golden-v7-sim-journey']) {
    if (!golden.includes(tag)) errors.push(`golden journey sin ${tag}`);
  }
}

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const scripts = pkg.scripts ?? {};
const catalogPath = join(root, 'tools/gates/catalog-full.json');
const catalog = existsSync(catalogPath) ? JSON.parse(readFileSync(catalogPath, 'utf8')) : null;

for (const script of ['case-intel:pipeline:catalog', 'case-intel:export-evolab', 'ai:evals:sim']) {
  if (!scripts[script]) errors.push(`package.json sin script ${script}`);
}

for (const script of ['quality:case-intel-gate', 'quality:case-intel-assist-gate']) {
  if (!catalog?.gates?.[script]) errors.push(`catalog-full.json sin ${script}`);
}

const gate = spawnSync('node', ['tools/gates/run-legacy.mjs', 'quality:case-intel-gate'], {
  cwd: root,
  stdio: 'pipe',
  encoding: 'utf8',
});
if (gate.status !== 0) {
  errors.push('quality:case-intel-gate falló (precondición cierre)');
  if (gate.stderr) errors.push(gate.stderr.trim().slice(0, 400));
}

if (errors.length) {
  console.error('case-intel-closure-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('case-intel-closure-gate OK — programa MF-CASE-01…11 signoff');
process.exit(0);
