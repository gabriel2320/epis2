#!/usr/bin/env node
/**
 * MF-CASE-10: gate matriz assist SIM + golden journey v6 (sin Ollama live).
 * Uso: npm run quality:case-intel-assist-gate
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const matrixPath = join(root, 'packages/test-fixtures/src/simAssistEvals.ts');
const goldenApiPath = join(root, 'tests/golden-clinical-journey.api.spec.ts');
const evalsDocPath = join(root, 'docs/product/EPIS2_AI_TRAMO_EVALS.md');

if (!existsSync(matrixPath)) {
  errors.push('falta packages/test-fixtures/src/simAssistEvals.ts');
}

if (!existsSync(goldenApiPath)) {
  errors.push('falta tests/golden-clinical-journey.api.spec.ts');
} else {
  const golden = readFileSync(goldenApiPath, 'utf8');
  if (!golden.includes('golden-v6-sim-assist')) {
    errors.push('golden-clinical-journey.api.spec.ts sin golden-v6-sim-assist');
  }
}

if (!existsSync(evalsDocPath)) {
  errors.push('falta docs/product/EPIS2_AI_TRAMO_EVALS.md');
} else {
  const doc = readFileSync(evalsDocPath, 'utf8');
  if (!doc.includes('ai:evals:sim') || !doc.includes('MF-CASE-10')) {
    errors.push('EPIS2_AI_TRAMO_EVALS.md sin sección MF-CASE-10 / ai:evals:sim');
  }
}

function runVitest(pattern) {
  const isWin = process.platform === 'win32';
  const bin = isWin ? 'npx.cmd' : 'npx';
  return spawnSync(bin, ['vitest', 'run', pattern], {
    cwd: root,
    stdio: 'pipe',
    shell: isWin,
    encoding: 'utf8',
  });
}

for (const target of [
  'packages/test-fixtures/src/simAssistEvals.test.ts',
  'packages/test-fixtures/src/simCases.test.ts',
]) {
  const result = runVitest(target);
  if (result.status !== 0) {
    errors.push(`vitest falló: ${target}`);
    if (result.stderr) errors.push(result.stderr.trim().slice(0, 400));
  }
}

if (errors.length) {
  console.error('case-intel-assist-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('case-intel-assist-gate OK — matriz SIM assist y golden v6 documentados');
