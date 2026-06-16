#!/usr/bin/env node
/** MF-SEC-01/02 — RH-09 Gitleaks + RH-10 CodeQL blocking (PROG-POST-RC3 Tramo 5). */
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
  if (src.includes('continue-on-error: true')) {
    errors.push(`${rel} no debe tener continue-on-error (${rhId} blocking)`);
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

const gitleaksConfig = join(root, '.gitleaks.toml');
if (!existsSync(gitleaksConfig)) {
  errors.push(`Falta ${gitleaksConfig}`);
} else if (!readFileSync(gitleaksConfig, 'utf8').includes('RH-09')) {
  errors.push('.gitleaks.toml debe referenciar RH-09');
}

const codeqlConfig = join(root, 'codeql/codeql-config.yml');
if (!existsSync(codeqlConfig)) {
  errors.push(`Falta ${codeqlConfig}`);
}

if (errors.length) {
  console.error('security-promote-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('security-promote-gate OK — RH-09 Gitleaks + RH-10 CodeQL blocking');
