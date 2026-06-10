#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const shell = readFileSync(
  join(root, 'apps/web/src/components/classic-md3/EpisClassicMd3Shell.tsx'),
  'utf8',
);
const errors = [];
if (!shell.includes('patientHeader') || !shell.includes('mainPane')) {
  errors.push('Classic debe mantener patient header y main pane');
}
const modes = readFileSync(join(root, 'apps/web/src/modes/episModes.ts'), 'utf8');
if (!modes.includes('requiresPatient: true')) errors.push('Classic debe requerir paciente');

if (errors.length) {
  console.error('classic-mode-isolation-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('classic-mode-isolation-gate OK');
