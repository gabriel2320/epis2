#!/usr/bin/env node
/** MF-LX-02 — lexicon ES-CL derivado del manifest (sin IA). */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const pkgDir = join(root, 'packages/clinical-lexicon-es-cl');
const indexPath = join(pkgDir, 'src/index.ts');

if (!existsSync(indexPath)) {
  errors.push('Falta packages/clinical-lexicon-es-cl');
}

const indexSrc = existsSync(indexPath) ? readFileSync(indexPath, 'utf8') : '';
for (const token of [
  'CLINICAL_LEXICON_ES_CL',
  'resolveClinicalLexicon',
  'shouldEscalateToAi',
  'CLINICAL_ABBREVIATIONS_ES_CL',
]) {
  if (!indexSrc.includes(token)) {
    errors.push(`clinical-lexicon-es-cl/index.ts falta export ${token}`);
  }
}

const pkg = JSON.parse(readFileSync(join(pkgDir, 'package.json'), 'utf8'));
if (pkg.dependencies?.['@epis2/command-registry'] !== '*') {
  errors.push('clinical-lexicon-es-cl debe depender de @epis2/command-registry');
}

const vitest = spawnSync(
  'npx',
  ['vitest', 'run', 'packages/clinical-lexicon-es-cl/src/lexicon.test.ts'],
  { cwd: root, encoding: 'utf8', shell: true },
);
if (vitest.status !== 0) {
  errors.push('clinical-lexicon-es-cl tests fallaron');
  if (vitest.stdout) process.stdout.write(vitest.stdout);
  if (vitest.stderr) process.stderr.write(vitest.stderr);
}

if (errors.length) {
  console.error(
    'clinical-lexicon-es-cl-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('clinical-lexicon-es-cl-gate OK — lexicon ES-CL MF-LX-02');
