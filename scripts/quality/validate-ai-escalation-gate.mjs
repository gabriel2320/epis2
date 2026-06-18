#!/usr/bin/env node
/** MF-LX-06 — política IA-last canónica en command-registry. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const escalationPath = join(root, 'packages/command-registry/src/ai-escalation.ts');
const lexiconResolvePath = join(root, 'packages/clinical-lexicon-es-cl/src/resolve.ts');

if (!existsSync(escalationPath)) {
  errors.push('Falta packages/command-registry/src/ai-escalation.ts');
}

const escalationSrc = existsSync(escalationPath) ? readFileSync(escalationPath, 'utf8') : '';
for (const token of [
  'AI_ESCALATION_LEXICON_CONFIDENCE',
  'resolveAiEscalation',
  'shouldEscalateLexiconConfidence',
  'assertAiEscalationInvariants',
  'AI_ESCALATION_MANIFEST_AI_REQUIRED_COUNT',
]) {
  if (!escalationSrc.includes(token)) {
    errors.push(`ai-escalation.ts falta ${token}`);
  }
}

const indexSrc = readFileSync(join(root, 'packages/command-registry/src/index.ts'), 'utf8');
for (const exportName of [
  'resolveAiEscalation',
  'shouldEscalateLexiconConfidence',
  'assertAiEscalationInvariants',
  'AI_ESCALATION_LEXICON_CONFIDENCE',
]) {
  if (!indexSrc.includes(exportName)) {
    errors.push(`command-registry/index.ts no exporta ${exportName}`);
  }
}

const lexiconResolveSrc = existsSync(lexiconResolvePath)
  ? readFileSync(lexiconResolvePath, 'utf8')
  : '';
if (!lexiconResolveSrc.includes('shouldEscalateLexiconConfidence')) {
  errors.push('clinical-lexicon resolve.ts debe delegar shouldEscalateLexiconConfidence');
}

const vitest = spawnSync(
  'npx',
  ['vitest', 'run', 'packages/command-registry/src/ai-escalation.test.ts'],
  { cwd: root, encoding: 'utf8', shell: true },
);
if (vitest.status !== 0) {
  errors.push('ai-escalation tests fallaron');
  if (vitest.stdout) process.stdout.write(vitest.stdout);
  if (vitest.stderr) process.stderr.write(vitest.stderr);
}

if (errors.length) {
  console.error('ai-escalation-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('ai-escalation-gate OK — política IA-last MF-LX-06');
