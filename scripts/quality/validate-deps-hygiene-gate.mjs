#!/usr/bin/env node
/** MF-DEP-01 — triage Dependabot + ignores persistentes (PROG-POST-RC3 Tramo 4). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const triagePath = join(root, 'docs/product/EPIS2_DEPENDABOT_TRIAGE.md');
const dependabotPath = join(root, '.github/dependabot.yml');

if (!existsSync(triagePath)) {
  errors.push(`Falta triage doc: ${triagePath}`);
} else {
  const src = readFileSync(triagePath, 'utf8');
  for (const needle of ['PROG-DEPS-HYGIENE', 'PROG-ZOD4-MIGRATION', '#5', 'zod']) {
    if (!src.includes(needle)) errors.push(`triage doc falta ${needle}`);
  }
}

if (!existsSync(dependabotPath)) {
  errors.push(`Falta ${dependabotPath}`);
} else {
  const src = readFileSync(dependabotPath, 'utf8');
  for (const needle of [
    'dependency-name: zod',
    'version-update:semver-major',
    "dependency-name: '@types/node'",
    'dependency-name: actions/checkout',
  ]) {
    if (!src.includes(needle)) errors.push(`dependabot.yml falta ${needle}`);
  }
}

if (errors.length) {
  console.error('deps-hygiene-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('deps-hygiene-gate OK — triage doc + dependabot ignores');
