#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dir = join(root, 'apps/web/src/components/classic-md3');
const required = [
  'EpisClassicMd3TopAppBar.tsx',
  'EpisClassicMd3PatientHeader.tsx',
  'EpisClassicMd3LeftNavigation.tsx',
  'EpisClassicMd3MainPane.tsx',
];
const errors = required.filter((f) => !existsSync(join(dir, f))).map((f) => `Falta ${f}`);
const shell = join(dir, 'EpisClassicMd3Shell.tsx');
if (existsSync(shell) && !readFileSync(shell, 'utf8').includes('100dvh')) {
  errors.push('Shell clásico debe usar 100dvh');
}
if (errors.length) {
  console.error('classic-fixed-panels-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('classic-fixed-panels-gate OK');
