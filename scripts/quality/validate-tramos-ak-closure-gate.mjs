#!/usr/bin/env node
/** Cadena A–K — todos los closure gates registrados (estructura). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const TRAMOS = 'ABCDEFGHIJK'.split('');
const pkg = readFileSync(join(root, 'package.json'), 'utf8');

for (const id of TRAMOS) {
  const gateScript = `validate-tramo-${id.toLowerCase()}-closure-gate.mjs`;
  const npmGate = `quality:tramo-${id.toLowerCase()}-closure-gate`;
  if (!existsSync(join(root, 'scripts/quality', gateScript))) {
    errors.push(`falta ${gateScript}`);
  }
  if (!pkg.includes(`"${npmGate}"`)) errors.push(`package.json sin ${npmGate}`);
}

const master = readFileSync(join(root, 'docs/product/EPIS2_TRAMOS_EXECUTION_MASTER.md'), 'utf8');
if (!master.includes('Cadena A–K')) errors.push('plan maestro sin Cadena A–K');
if (!master.includes('quality:tramo-k-closure-gate')) {
  errors.push('plan maestro sin tramo-k-closure-gate');
}

if (errors.length) {
  console.error('tramos-ak-closure-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('tramos-ak-closure-gate OK — closure gates A–K registrados');
