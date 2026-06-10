#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const src = readFileSync(
  join(root, 'apps/web/src/components/classic-md3/EpisClassicMd3SupportingPane.tsx'),
  'utf8',
);
const errors = [];
if (!src.includes('component="aside"')) errors.push('Supporting pane debe ser aside MD3');
if (src.includes('Guardar') || src.includes('Firmar')) {
  errors.push('Supporting pane no debe duplicar acciones globales');
}
if (errors.length) {
  console.error(
    'classic-supporting-pane-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}
console.log('classic-supporting-pane-gate OK');
