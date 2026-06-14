#!/usr/bin/env node
/** MF-IM-08 — eval anti feedback-loop AIAST (sin Ollama). */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const result = spawnSync(
  'npx',
  [
    'vitest',
    'run',
    'services/local-ai/src/rag/assistContextPolicy.test.ts',
    'services/local-ai/src/rag/assistCitations.test.ts',
  ],
  { cwd: root, shell: true, stdio: 'inherit' },
);

if (result.status !== 0) {
  console.error('ai:evals:feedback-loop FAILED');
  process.exit(1);
}

console.log('ai:evals:feedback-loop OK — MF-IM-08 sim');
