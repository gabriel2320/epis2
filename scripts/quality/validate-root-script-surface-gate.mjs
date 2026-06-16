#!/usr/bin/env node
/** PROG-SCRIPT-DIET-3 SD-04 — root package.json ≤18 scripts humanos. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT_SCRIPT_ALLOWLIST } from '../../tools/scripts/root-script-allowlist.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const scripts = Object.keys(pkg.scripts ?? {});
const max = ROOT_SCRIPT_ALLOWLIST.length;
const errors = [];

if (scripts.length > max) {
  errors.push(`root tiene ${scripts.length} scripts (máx ${max})`);
}

for (const name of scripts) {
  if (!ROOT_SCRIPT_ALLOWLIST.includes(name)) {
    errors.push(`script no allowlisted: ${name}`);
  }
}

for (const name of ROOT_SCRIPT_ALLOWLIST) {
  if (!pkg.scripts?.[name]) {
    errors.push(`falta script allowlisted: ${name}`);
  }
}

if (!readFileSync(join(root, 'docs/dev/SCRIPT_INDEX.md'), 'utf8').includes('tool:script')) {
  errors.push('SCRIPT_INDEX.md debe documentar tool:script');
}

if (errors.length) {
  console.error('root-script-surface-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`root-script-surface-gate OK — ${scripts.length} scripts root (máx ${max})`);
