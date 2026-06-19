#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const schemas = readFileSync(join(root, 'apps/web/src/lab/design-agents/schemas.ts'), 'utf8');
for (const s of ['ThreeModesArchitectureResultSchema', 'ModeTransitionResultSchema']) {
  if (!schemas.includes(s)) errors.push(`Falta ${s}`);
}

if (errors.length) {
  console.error(
    'three-modes-design-agents-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}
console.log('three-modes-design-agents-gate OK');
