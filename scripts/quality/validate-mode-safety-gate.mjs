#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const universal = readFileSync(
  join(root, 'apps/web/src/components/command/EpisUniversalCommandBar.tsx'),
  'utf8',
);
if (!universal.includes('command-center') || !universal.includes('classic-contextual')) {
  errors.push('EpisUniversalCommandBar debe tener variantes por modo');
}
if (universal.includes('firmar') || universal.includes('approve')) {
  errors.push('Command bar no debe auto-firmar');
}

if (errors.length) {
  console.error('mode-safety-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('mode-safety-gate OK');
