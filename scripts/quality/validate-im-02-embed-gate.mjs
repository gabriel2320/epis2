#!/usr/bin/env node
/** MF-IM-02 — contrato embedDocument + tests + smoke opcional. */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  ['rag contract', 'packages/contracts/src/rag.ts'],
  ['embedDocument service', 'services/local-ai/src/embedDocument.ts'],
  ['closure report', 'reports/epis2-mf-im-02-embed-api.md'],
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

run('MF-IM-02 contracts', 'npx', ['vitest', 'run', 'packages/contracts/src/rag.test.ts'], {
  inherit: true,
});

run(
  'MF-IM-02 embedDocument',
  'npx',
  ['vitest', 'run', 'services/local-ai/src/embedDocument.test.ts'],
  {
    inherit: true,
  },
);

run(
  'MF-IM-02 gateway capabilities',
  'npx',
  ['vitest', 'run', 'services/local-ai/src/gatewayCapabilities.test.ts'],
  { inherit: true },
);

const smoke = spawnSync('npm', ['run', 'ai:embed-smoke'], {
  cwd: root,
  shell: true,
  stdio: 'pipe',
  encoding: 'utf8',
});
if (smoke.status !== 0) {
  console.warn('(i) ai:embed-smoke omitido o falló — requiere Ollama + dev:ai');
} else {
  console.log('ai:embed-smoke OK');
}

if (errors.length) {
  console.error('im-02-embed-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('im-02-embed-gate OK — MF-IM-02');
