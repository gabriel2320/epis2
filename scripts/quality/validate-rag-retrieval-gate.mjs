#!/usr/bin/env node
/** MF-IM-03/04 — RAG secuencial + assist con citas documentales. */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  ['sequential retrieval', 'services/local-ai/src/rag/sequentialRetrieval.ts'],
  ['assist citations', 'services/local-ai/src/rag/assistCitations.ts'],
  ['no-hallucination guard', 'services/local-ai/src/rag/noHallucinationGuard.ts'],
  ['rag index', 'services/local-ai/src/rag/index.ts'],
  ['demo-005 fixture', 'packages/test-fixtures/src/demoRagChunks.ts'],
  ['closure im-03', 'reports/epis2-mf-im-03-rag-incremental.md'],
  ['closure im-04', 'reports/epis2-mf-im-04-assist-citas.md'],
];

for (const [label, rel] of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${label}: ${rel}`);
}

function run(label, cmd, args, { inherit = false } = {}) {
  const result = spawnSync(cmd, args, {
    cwd: root,
    shell: true,
    stdio: inherit ? 'inherit' : 'pipe',
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    errors.push(`${label} falló`);
    if (!inherit && result.stderr) process.stderr.write(result.stderr);
  }
}

run('build contracts', 'npm', ['run', 'build', '-w', '@epis2/contracts']);

run('MF-IM-03 demo-005 fixture', 'npx', [
  'vitest',
  'run',
  'packages/test-fixtures/src/demoRagChunks.test.ts',
], { inherit: true });

run('MF-IM-03 sequential retrieval', 'npx', [
  'vitest',
  'run',
  'services/local-ai/src/rag/sequentialRetrieval.test.ts',
], { inherit: true });

run('MF-IM-04 assist citations', 'npx', [
  'vitest',
  'run',
  'services/local-ai/src/rag/assistCitations.test.ts',
], { inherit: true });

run('MF-IM-04 rag citation eval sim', 'node', [
  'scripts/ai/evals/run-rag-citation-evals.mjs',
], { inherit: true });

if (errors.length) {
  console.error('rag-retrieval-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('rag-retrieval-gate OK — MF-IM-03 + MF-IM-04');
