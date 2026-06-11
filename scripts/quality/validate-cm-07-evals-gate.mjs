#!/usr/bin/env node
/** MF-CM-07 — evals + frases coloquiales ampliadas. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  ['colloquial rules', 'packages/command-registry/src/colloquial-rules.ts'],
  ['phrase suite colloquial', 'packages/command-registry/src/clinical-phrase-suite-colloquial.ts'],
  ['command intent top10', 'packages/command-registry/src/command-intent-top10.ts'],
  ['command evals runner', 'scripts/ai/evals/run-command-phrase-evals.mjs'],
  ['closure report', 'reports/epis2-mf-cm-07-evals.md'],
];

for (const [label, rel] of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${label}: ${rel}`);
}

const colloquial = readFileSync(
  join(root, 'packages/command-registry/src/colloquial-rules.ts'),
  'utf8',
);
if (!colloquial.includes('check-labs-colloquial') || !colloquial.includes('nursing-med-admin')) {
  errors.push('colloquial-rules debe incluir reglas ampliadas MF-CM-07');
}

const evalRunner = readFileSync(
  join(root, 'scripts/ai/evals/run-command-phrase-evals.mjs'),
  'utf8',
);
if (!evalRunner.includes('COMMAND_PHRASE_SUITE')) {
  errors.push('run-command-phrase-evals debe evaluar COMMAND_PHRASE_SUITE');
}

const vitest = spawnSync('node', ['scripts/ai/evals/run-command-phrase-evals.mjs'], {
  cwd: root,
  stdio: 'inherit',
});
if (vitest.status !== 0) errors.push('ai:evals:command falló');

if (errors.length) {
  console.error('cm-07-evals-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('cm-07-evals-gate OK — MF-CM-07 (live assist: npm run ai:evals:live con dev:ai)');
