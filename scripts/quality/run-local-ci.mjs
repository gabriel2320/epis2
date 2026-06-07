#!/usr/bin/env node
/**
 * Automatiza paridad local con CI: Docker Postgres, migrate, gates y E2E opcional.
 * Uso: npm run quality:local-ci
 */
import { spawnSync } from 'node:child_process';
import { loadEnvFile } from '../load-env.mjs';

loadEnvFile();

const steps = [
  { name: 'docker compose up -d postgres', cmd: 'docker', args: ['compose', 'up', '-d', 'postgres'] },
  { name: 'quality:dev-env-gate', cmd: 'npm', args: ['run', 'quality:dev-env-gate'] },
  { name: 'quality:stack-dev-gate', cmd: 'npm', args: ['run', 'quality:stack-dev-gate'] },
  { name: 'db:migrate', cmd: 'npm', args: ['run', 'db:migrate'] },
  { name: 'check', cmd: 'npm', args: ['run', 'check'] },
  { name: 'test', cmd: 'npm', args: ['run', 'test'] },
  { name: 'quality:ci-parity', cmd: 'npm', args: ['run', 'quality:ci-parity'] },
  { name: 'db:validate', cmd: 'npm', args: ['run', 'db:validate'] },
  { name: 'ai:evals', cmd: 'npm', args: ['run', 'ai:evals'] },
  { name: 'quality:microphases', cmd: 'npm', args: ['run', 'quality:microphases'] },
];

function runStep(step) {
  console.log(`\n▶ ${step.name}`);
  const isWin = process.platform === 'win32';
  const bin = isWin && step.cmd === 'npm' ? 'npm.cmd' : step.cmd;
  const result = spawnSync(bin, step.args, {
    stdio: 'inherit',
    env: process.env,
    shell: step.cmd === 'docker' || (isWin && (step.cmd === 'node' || step.cmd === 'npm')),
  });
  if (result.status !== 0) {
    if (step.optional) {
      console.warn(`⚠ ${step.name} omitido (opcional)`);
      return;
    }
    console.error(`\n✗ quality:local-ci FAILED en ${step.name}`);
    process.exit(result.status ?? 1);
  }
}

console.log('EPIS2 quality:local-ci — paridad local ↔ CI\n');

for (const step of steps) {
  runStep(step);
}

if (process.env.EPIS2_LOCAL_CI_E2E === '1') {
  runStep({ name: 'test:e2e', cmd: 'npm', args: ['run', 'test:e2e'] });
} else {
  console.log('\n(i) E2E omitido — define EPIS2_LOCAL_CI_E2E=1 para incluir Playwright');
}

if (process.env.EPIS2_LOCAL_CI_TRAMO_E2E === '1') {
  runStep({ name: 'test:e2e:tramo-j', cmd: 'npm', args: ['run', 'test:e2e:tramo-j'] });
} else {
  console.log('(i) E2E tramo J omitido — define EPIS2_LOCAL_CI_TRAMO_E2E=1');
}

console.log('\n✓ quality:local-ci OK');
