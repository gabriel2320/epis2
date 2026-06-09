#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
if (!existsSync(join(root, 'apps/web/src/design-agents/visualDensityAgent.ts'))) {
  console.error('visual-density-agent-gate FAILED: falta visualDensityAgent.ts');
  process.exit(1);
}
console.log('visual-density-agent-gate OK');
