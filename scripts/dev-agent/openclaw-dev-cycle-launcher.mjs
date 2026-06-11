#!/usr/bin/env node
/**
 * Lanzador ciclo completo EPIS2 — OpenClaw + Ollama + Evolab.
 *
 *   npm run dev:auto:cycle -- --commit [--push] [--parallel] [--dry-run]
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { applyDevCycleEnv, runCycleBootstrap, runCycleClose } from './openclaw-dev-cycle.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const doCommit = args.includes('--commit');
const doPush = args.includes('--push');
const parallel = args.includes('--parallel') || process.env.EPIS2_AUTO_DEV_PARALLEL === '1';
const continueOnFail = args.includes('--continue-on-fail');

process.env = applyDevCycleEnv(process.env);

console.log('EPIS2 dev:auto:cycle — OpenClaw + Ollama + Evolab\n');
console.log('  OpenClaw: orquesta brief/handoff/verify (L3 MAX POWER)');
console.log('  Ollama:   plan + ollama-auto por tramo');
console.log('  Evolab:   doctor/smoke/validate + sync hallazgos');
console.log(`  Modo:     ${parallel ? 'parallel (PM-03 + evolve background)' : 'orchestrate secuencial'}\n`);

if ((doCommit || doPush) && process.env.EPIS2_AUTO_DEV_AUTHORIZED !== '1') {
  console.error('Set EPIS2_AUTO_DEV_AUTHORIZED=1 para commit/push');
  process.exit(1);
}

const boot = runCycleBootstrap({ dryRun });
if (!boot.ok) {
  console.error(`dev:auto:cycle FAILED bootstrap (${boot.stage})`);
  process.exit(1);
}

process.env.EPIS2_DEV_CYCLE_SKIP_BOOTSTRAP = '1';

const targetScript = parallel ? 'dev:auto:parallel' : 'dev:auto:orchestrate';
const npmArgs = ['run', targetScript, '--'];
if (doCommit) npmArgs.push('--commit');
if (doPush) npmArgs.push('--push');
if (continueOnFail) npmArgs.push('--continue-on-fail');
if (dryRun) npmArgs.push('--dry-run');

console.log(`\n▶ ${targetScript}\n`);
const r = spawnSync('npm', npmArgs, {
  cwd: root,
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

if (!dryRun) {
  runCycleClose({ dryRun: false });
}

if (r.status !== 0) {
  console.error('\ndev:auto:cycle FAILED');
  process.exit(r.status ?? 1);
}

console.log('\ndev:auto:cycle OK');
console.log('  Estado: reports/epis2-dev-cycle-status.json');
console.log('  OpenClaw: reports/openclaw-latest-handoff.md');
