#!/usr/bin/env node
/**
 * PROG-CONSOLIDATE Fase 4 + MF-CON-11 — verifica manifiestos y workflows CI.
 *   npm run tool:consolidate:verify-phase4
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const ciGates = [
  'quality:case-intel-closure-gate',
  'quality:openapi-gate',
  'quality:pm01',
  'quality:layers-integration-gate',
  'quality:ci-parity',
  'quality:golden-journey',
  'quality:dual-chart-gate',
];

const catalog = JSON.parse(readFileSync(join(root, 'tools/gates/catalog-full.json'), 'utf8'));
for (const gate of ciGates) {
  if (!catalog.gates?.[gate]) errors.push(`catalog-full sin ${gate}`);
}

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
if (!pkg.scripts?.['build:ci-fixtures-chain']) {
  errors.push('package.json sin build:ci-fixtures-chain');
}
if (!pkg.scripts?.['build:packages']?.includes('@epis2/ai-client')) {
  errors.push('build:packages debe incluir @epis2/ai-client antes de local-ai');
}
if (!pkg.scripts?.['quality:experimental']) {
  errors.push('package.json sin quality:experimental (MF-CON-11)');
}
if (!pkg.scripts?.['quality:release']) {
  errors.push('package.json sin quality:release (PROG-RELEASE-HARDENING RH-08)');
}

for (const script of ['db:migrate', 'test:e2e', 'test:e2e:dual-chart']) {
  if (!pkg.scripts?.[script]?.includes('@epis2/')) {
    errors.push(`root ${script} debe ser shim a workspace`);
  }
}

const workflowChecks = [
  ['.github/workflows/ci.yml', ['quality:required', 'e2e-dual-chart']],
  ['.github/workflows/ci-nightly.yml', ['quality:nightly']],
  ['.github/workflows/ci-experimental.yml', ['quality:experimental']],
];

for (const [rel, needles] of workflowChecks) {
  if (!existsSync(join(root, rel))) {
    errors.push(`Falta workflow ${rel}`);
    continue;
  }
  const content = readFileSync(join(root, rel), 'utf8');
  for (const needle of needles) {
    if (!content.includes(needle)) errors.push(`${rel} debe incluir ${needle}`);
  }
}

const rhReportOnlyWorkflows = [
  '.github/workflows/ci-rh04-deps.yml',
  '.github/workflows/ci-rh05-sbom.yml',
];
for (const rel of rhReportOnlyWorkflows) {
  if (!existsSync(join(root, rel))) {
    errors.push(`Falta workflow ${rel} (PROG-RELEASE-HARDENING)`);
    continue;
  }
  const content = readFileSync(join(root, rel), 'utf8');
  if (!content.includes('continue-on-error: true')) {
    errors.push(`${rel} debe ser report-only (continue-on-error)`);
  }
}

const blockingRhWorkflows = [
  ['.github/workflows/ci-rh03-gitleaks.yml', 'RH-09'],
  ['.github/workflows/ci-rh02-codeql.yml', 'RH-10'],
];
for (const [rel, rhId] of blockingRhWorkflows) {
  if (!existsSync(join(root, rel))) {
    errors.push(`Falta workflow ${rel} (${rhId})`);
    continue;
  }
  const content = readFileSync(join(root, rel), 'utf8');
  if (content.includes('continue-on-error: true')) {
    errors.push(`${rel} ${rhId} debe ser blocking (sin continue-on-error)`);
  }
  if (!content.includes(rhId)) {
    errors.push(`${rel} debe referenciar ${rhId}`);
  }
}

for (const manifest of ['required', 'nightly', 'experimental', 'release']) {
  const dry = spawnSync('node', ['tools/gates/run-gate.mjs', '--dry-run', manifest], {
    cwd: root,
    encoding: 'utf8',
  });
  if (dry.status !== 0) errors.push(`gate ${manifest} dry-run falló`);
}

if (errors.length) {
  console.error('phase4-verify FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('phase4-verify OK — CI tiers, manifiestos y shims workspace');
