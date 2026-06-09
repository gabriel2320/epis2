#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const src = readFileSync(
  join(root, 'apps/web/src/components/classic-md3/EpisClassicMd3CommandBar.tsx'),
  'utf8',
);
const errors = [];
if (!src.includes('EPIS_COMMAND_BAR_MAX_SUGGESTIONS')) {
  errors.push('Command bar clásica debe respetar máx. 4 sugerencias');
}
if (src.includes('mayAutoSign')) errors.push('Command bar no debe firmar automáticamente');
if (errors.length) {
  console.error('classic-commandbar-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('classic-commandbar-gate OK');
