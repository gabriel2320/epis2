#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const src = readFileSync(
  join(root, 'apps/web/src/components/classic-md3/EpisClassicMd3StatusBar.tsx'),
  'utf8',
);
const topSrc = readFileSync(
  join(root, 'apps/web/src/components/classic-md3/EpisClassicMd3TopAppBar.tsx'),
  'utf8',
);
const errors = [];
if (src.includes('EpisButton') && src.match(/Guardar|Firmar|Aprobar/)) {
  errors.push('Status bar no debe contener botones clínicos principales');
}
if (topSrc.match(/Guardar|Firmar|Imprimir|Aprobar/)) {
  errors.push('Top bar no debe contener guardar/firmar/imprimir');
}
if (errors.length) {
  console.error('classic-statusbar-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('classic-statusbar-gate OK');
