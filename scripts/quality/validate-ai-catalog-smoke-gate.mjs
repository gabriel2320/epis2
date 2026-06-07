#!/usr/bin/env node
/** Semana 3 — smoke catálogo visual + capabilities assist. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

if (!existsSync(join(root, 'scripts/ai-catalog-assist-smoke.mjs'))) {
  errors.push('falta ai-catalog-assist-smoke.mjs');
}

const e2e = join(root, 'e2e/week3-ai-tramo-j.spec.ts');
if (!existsSync(e2e)) errors.push('falta e2e/week3-ai-tramo-j.spec.ts');

const e2eText = existsSync(e2e) ? readFileSync(e2e, 'utf8') : '';
if (!e2eText.includes('catalogo-visual')) errors.push('e2e week3 sin catálogo visual');

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
if (!pkg.includes('"ai:catalog-assist-smoke"')) errors.push('package.json sin ai:catalog-assist-smoke');
if (!pkg.includes('"test:e2e:week3"')) errors.push('package.json sin test:e2e:week3');

if (errors.length) {
  console.error('ai-catalog-smoke-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ai-catalog-smoke-gate OK — catálogo visual + assist smoke registrados');
