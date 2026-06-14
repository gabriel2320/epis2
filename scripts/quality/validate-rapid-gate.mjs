#!/usr/bin/env node
/** MF-RAPID-04 — smoke del loop rápido (fast + schemas + audit dry-run + dev:rapid). */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  ['contexto mínimo', 'docs/AGENT_CONTEXT_MINIMAL.md'],
  ['regla fast loop', '.cursor/rules/50-fast-loop.mdc'],
  ['quality loop lib', 'scripts/quality/quality-loop-lib.mjs'],
  ['quality:fast', 'scripts/quality/run-quality-fast.mjs'],
  ['quality:clinical', 'scripts/quality/run-quality-clinical.mjs'],
  ['quality:full', 'scripts/quality/run-quality-full.mjs'],
  ['dev:rapid', 'scripts/dev/run-dev-rapid.mjs'],
  ['audit diff', 'scripts/dev-agent/ollama-audit-diff.mjs'],
  ['closure report', 'reports/epis2-mf-rapid-close-2026.md'],
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

run('MF-RAPID schemas suite', 'npx', ['vitest', 'run', 'scripts/dev-agent/schemas.test.mjs'], {
  inherit: true,
});

run('MF-RAPID audit-diff dry-run', 'node', ['scripts/dev-agent/ollama-audit-diff.mjs', '--dry-run'], {
  inherit: true,
});

run('MF-RAPID dev:rapid (skip audit)', 'npm', ['run', 'dev:rapid', '--', '--skip-audit'], {
  inherit: true,
});

if (errors.length) {
  console.error('rapid-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('rapid-gate OK — MF-RAPID-04');
