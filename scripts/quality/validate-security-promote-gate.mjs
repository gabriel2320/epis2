#!/usr/bin/env node
/** MF-SEC-01/02/03 — RH-09/10/11 security promote (PROG-POST-RC3 Tramo 5). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

function assertBlockingWorkflow(rel, rhId, needles) {
  const path = join(root, rel);
  if (!existsSync(path)) {
    errors.push(`Falta workflow: ${rel}`);
    return;
  }
  const src = readFileSync(path, 'utf8');
  if (src.includes('continue-on-error: true') && rel !== '.github/workflows/ci-rh04-deps.yml') {
    errors.push(`${rel} no debe tener continue-on-error a nivel archivo (${rhId} blocking)`);
  }
  for (const needle of needles) {
    if (!src.includes(needle)) errors.push(`${rel} falta ${needle}`);
  }
}

assertBlockingWorkflow('.github/workflows/ci-rh03-gitleaks.yml', 'RH-09', [
  'RH-09',
  'blocking',
  'gitleaks/gitleaks-action',
]);
assertBlockingWorkflow('.github/workflows/ci-rh02-codeql.yml', 'RH-10', [
  'RH-10',
  'blocking',
  'github/codeql-action/analyze',
]);

const depsWorkflow = join(root, '.github/workflows/ci-rh04-deps.yml');
if (!existsSync(depsWorkflow)) {
  errors.push('Falta ci-rh04-deps.yml');
} else {
  const src = readFileSync(depsWorkflow, 'utf8');
  if (!src.includes('RH-11')) errors.push('ci-rh04-deps.yml debe referenciar RH-11');
  if (!src.includes('dependency-review (blocking)')) {
    errors.push('ci-rh04-deps.yml falta job dependency-review blocking');
  }
  const depSection = src.split('dependency-review:')[1]?.split('npm-audit-report:')[0] ?? '';
  if (depSection.includes('continue-on-error: true')) {
    errors.push('dependency-review no debe ser report-only (RH-11)');
  }
  const auditSection = src.split('npm-audit-report:')[1] ?? '';
  if (!auditSection.includes('continue-on-error: true')) {
    errors.push('npm-audit-report debe seguir report-only');
  }
  if (!src.includes('fail-on-severity: critical')) {
    errors.push('dependency-review debe usar fail-on-severity: critical');
  }
}

const waiverPath = join(root, 'docs/product/EPIS2_DEPENDENCY_REVIEW_WAIVER.md');
if (!existsSync(waiverPath)) {
  errors.push(`Falta waiver doc: ${waiverPath}`);
} else {
  const src = readFileSync(waiverPath, 'utf8');
  if (!src.includes('RH-11') || !src.includes('report-only')) {
    errors.push('waiver doc incompleto');
  }
}

const gitleaksConfig = join(root, '.gitleaks.toml');
if (!existsSync(gitleaksConfig)) {
  errors.push(`Falta ${gitleaksConfig}`);
} else if (!readFileSync(gitleaksConfig, 'utf8').includes('RH-09')) {
  errors.push('.gitleaks.toml debe referenciar RH-09');
}

const codeqlConfig = join(root, 'codeql/codeql-config.yml');
if (!existsSync(codeqlConfig)) errors.push(`Falta ${codeqlConfig}`);

const rh12Workflow = join(root, '.github/workflows/rh12-branch-protection-required-checks.yml');
if (!existsSync(rh12Workflow)) {
  errors.push(`Falta RH-12 workflow: ${rh12Workflow}`);
} else {
  const src = readFileSync(rh12Workflow, 'utf8');
  for (const needle of ['RH-12', 'workflow_dispatch', 'dependency-review (blocking)', 'e2e-dual-chart']) {
    if (!src.includes(needle)) errors.push(`RH-12 workflow falta ${needle}`);
  }
}

if (errors.length) {
  console.error('security-promote-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('security-promote-gate OK — RH-09/10/11 blocking + RH-12 auditor + waiver doc');
