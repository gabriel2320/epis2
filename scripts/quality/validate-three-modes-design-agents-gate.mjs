#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const agents = join(root, 'apps/web/src/design-agents/threeModesDesignAgents.ts');
if (!existsSync(agents)) errors.push('Falta threeModesDesignAgents.ts');

const schemas = readFileSync(join(root, 'apps/web/src/design-agents/schemas.ts'), 'utf8');
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
