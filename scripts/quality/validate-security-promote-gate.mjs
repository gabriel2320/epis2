#!/usr/bin/env node
/** MF-SEC-01 / RH-09 — Gitleaks blocking (PROG-POST-RC3 Tramo 5). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const workflowPath = join(root, '.github/workflows/ci-rh03-gitleaks.yml');
const gitleaksConfig = join(root, '.gitleaks.toml');

if (!existsSync(workflowPath)) {
  errors.push(`Falta workflow: ${workflowPath}`);
} else {
  const src = readFileSync(workflowPath, 'utf8');
  if (src.includes('continue-on-error: true')) {
    errors.push('ci-rh03-gitleaks.yml no debe tener continue-on-error (RH-09 blocking)');
  }
  for (const needle of ['RH-09', 'blocking', 'gitleaks/gitleaks-action']) {
    if (!src.includes(needle)) errors.push(`workflow falta ${needle}`);
  }
}

if (!existsSync(gitleaksConfig)) {
  errors.push(`Falta ${gitleaksConfig}`);
} else {
  const src = readFileSync(gitleaksConfig, 'utf8');
  if (!src.includes('RH-09')) errors.push('.gitleaks.toml debe referenciar RH-09');
}

if (errors.length) {
  console.error('security-promote-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('security-promote-gate OK — RH-09 Gitleaks blocking');
