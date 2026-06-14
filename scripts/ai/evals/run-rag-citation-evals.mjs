#!/usr/bin/env node
/** MF-IM-04 — eval sim no-hallucination + citas documentales (sin Ollama). */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../..');

const result = spawnSync(
  'npx',
  ['vitest', 'run', 'services/local-ai/src/rag/assistCitations.test.ts'],
  { cwd: root, shell: true, stdio: 'inherit' },
);

if (result.status !== 0) {
  console.error('ai:evals:rag-citations FAILED');
  process.exit(1);
}

console.log('ai:evals:rag-citations OK — MF-IM-04 sim');
