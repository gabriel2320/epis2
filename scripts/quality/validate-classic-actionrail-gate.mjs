#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const src = readFileSync(
  join(root, 'apps/web/src/components/classic-md3/EpisClassicMd3ActionRail.tsx'),
  'utf8',
);
const errors = [];
if (!src.includes('.slice(0, 10)')) errors.push('Action rail debe limitar iconos visibles');
if (src.includes('approve') || src.includes('Firmar')) {
  errors.push('Action rail no debe ejecutar acciones irreversibles');
}
if (errors.length) {
  console.error('classic-actionrail-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('classic-actionrail-gate OK');
