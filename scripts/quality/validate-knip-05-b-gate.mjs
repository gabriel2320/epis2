#!/usr/bin/env node
/** MF-KNIP-05-B — lote ≤10 exports safe; KNIP-04 intact. */
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const baselineExports = 116;
const loteMax = 10;
const loteReport = join(
  root,
  'reports/archive/2026-06/knip-audit-product-map-lote1-2026-06-18.md',
);
const agentsFile = join(root, 'apps/web/src/lab/design-agents/dashboardDesignAgents.ts');

if (!existsSync(loteReport)) {
  errors.push('falta reports/archive/2026-06/knip-audit-product-map-lote1-2026-06-18.md');
}

const run = spawnSync('npm', ['run', 'knip:audit', '--', '--reporter', 'compact'], {
  cwd: root,
  encoding: 'utf8',
  shell: true,
});
const out = `${run.stdout ?? ''}\n${run.stderr ?? ''}`;

/** @param {string} label */
function count(label) {
  const m = out.match(new RegExp(`^${label} \\((\\d+)\\)`, 'm'));
  return m ? Number(m[1]) : 0;
}

for (const label of [
  'Unused files',
  'Unused dependencies',
  'Unused devDependencies',
  'Unlisted dependencies',
  'Unlisted binaries',
  'Duplicate exports',
]) {
  const n = count(label);
  if (n > 0) errors.push(`${label}=${n} (KNIP-04 exige 0)`);
}

const exportCount = count('Unused exports');
const removed = baselineExports - exportCount;
if (removed < 1) errors.push(`exports no bajaron respecto baseline (${baselineExports})`);
if (removed > loteMax) errors.push(`lote excede máximo (${removed} > ${loteMax})`);

if (existsSync(agentsFile)) {
  const agentsSrc = readFileSync(agentsFile, 'utf8');
  for (const fn of [
    'dashboardWorkflowAgent',
    'dashboardDensityAgent',
    'dashboardPatchPlannerAgent',
  ]) {
    if (agentsSrc.includes(fn)) errors.push(`aún exporta ${fn}`);
  }
  if (!agentsSrc.includes('dashboardMd3CriticAgent')) {
    errors.push('falta dashboardMd3CriticAgent (test shell MD3)');
  }
}

if (existsSync(loteReport)) {
  const report = readFileSync(loteReport, 'utf8');
  if (!report.includes('Exports retirados')) errors.push('lote report sin tabla retirados');
}

if (errors.length) {
  console.error('knip-05-b-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(
  `knip-05-b-gate OK — exports=${exportCount} (baseline ${baselineExports}, −${removed}) · KNIP-04 metrics=0`,
);
