#!/usr/bin/env node
/** MF-IM-09 — OTel span ai.run en pipeline assist draft-suggestion. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  ['ai tracing helper', 'apps/api/src/ai/tracing.ts'],
  ['otel setup', 'apps/api/src/otel.ts'],
  ['closure im-09', 'reports/epis2-mf-im-09-otel.md'],
];

for (const [label, rel] of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${label}: ${rel}`);
}

const tracingSrc = readFileSync(join(root, 'apps/api/src/ai/tracing.ts'), 'utf8');
for (const token of ['ai.run', 'epis2-ai', 'latencyMs', 'blueprintId', 'withAiRunSpan']) {
  if (!tracingSrc.includes(token)) errors.push(`tracing.ts sin ${token}`);
}

const routesSrc = readFileSync(join(root, 'apps/api/src/ai/routes.ts'), 'utf8');
if (!routesSrc.includes('withAiRunSpan')) {
  errors.push('routes.ts no usa withAiRunSpan en assist/draft');
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

run('MF-IM-09 ai tracing unit', 'npx', ['vitest', 'run', 'apps/api/src/ai/tracing.test.ts'], {
  inherit: true,
});

run(
  'MF-IM-09 ai.run route smoke',
  'npx',
  ['vitest', 'run', 'apps/api/src/ai/routes.test.ts', '-t', 'MF-IM-09'],
  { inherit: true },
);

run('MF-NORM-203 otel smoke', 'npx', ['vitest', 'run', 'apps/api/src/otel.test.ts'], {
  inherit: true,
});

if (errors.length) {
  console.error('ai-otel-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('ai-otel-gate OK — MF-IM-09 span ai.run + trace smoke');
