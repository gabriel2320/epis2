#!/usr/bin/env node
/** EPIS2-PM-03 — gate orquestación autodesarrollo 6 h. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'docs/product/EPIS2_PM03_AUTO_ORCHESTRATION.md',
  'docs/product/EPIS2_EVOLAB_INTEGRATION.md',
  'docs/product/EPIS2_OPENCLAW_INTEGRATION.md',
  'docs/product/EPIS2_DEV_CYCLE_OPENCLAW.md',
  'scripts/dev-agent/openclaw-dev-cycle.mjs',
  'scripts/dev-agent/auto-dev-orchestrator.mjs',
  'scripts/dev-agent/auto-dev-preconditions.mjs',
  'scripts/dev-agent/evolab-bridge.mjs',
  'scripts/dev-agent/auto-dev-parallel-launcher.mjs',
  'scripts/dev-agent/start-auto-dev-integrated.ps1',
  'scripts/dev-agent/generate-auto-dev-cursor-prompt.mjs',
  'scripts/dev-agent/cursor-sdk-tramo.mjs',
  'scripts/dev-agent/start-auto-dev-6h.ps1',
  'scripts/dev-agent/auto-dev-6h-runner.mjs',
]) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
for (const script of ['dev:auto:orchestrate', 'dev:auto:preconditions', 'dev:auto:parallel', 'dev:auto:cycle', 'quality:pm03-orchestration-gate']) {
  if (!pkg.includes(`"${script}"`)) errors.push(`package.json sin ${script}`);
}

const envEx = readFileSync(join(root, '.env.example'), 'utf8');
if (!envEx.includes('EPIS2_AUTO_DEV_AUTHORIZED')) {
  errors.push('.env.example sin bloque PM-03 auto-dev');
}

const orch = readFileSync(join(root, 'scripts/dev-agent/auto-dev-orchestrator.mjs'), 'utf8');
if (!orch.includes('runTramoCycle')) {
  errors.push('orchestrator sin runTramoCycle (dev-cycle)');
}

const cycle = readFileSync(join(root, 'scripts/dev-agent/openclaw-dev-cycle.mjs'), 'utf8');
for (const token of ['generate-auto-dev-cursor-prompt', 'cursor-sdk-tramo', 'dev:auto:6h', 'auto-dev-preconditions']) {
  if (!cycle.includes(token)) errors.push(`openclaw-dev-cycle sin ${token}`);
}

if (!envEx.includes('EPIS2_EVOLAB_ROOT')) {
  errors.push('.env.example sin EPIS2_EVOLAB_ROOT');
}

if (!envEx.includes('EPIS2_OPENCLAW_SESSION')) {
  errors.push('.env.example sin EPIS2_OPENCLAW_SESSION');
}

const orchOpenclaw = readFileSync(join(root, 'scripts/dev-agent/auto-dev-orchestrator.mjs'), 'utf8');
if (!orchOpenclaw.includes('EPIS2_AUTO_DEV_OPENCLAW')) {
  errors.push('orchestrator sin EPIS2_AUTO_DEV_OPENCLAW');
}

if (errors.length) {
  console.error('pm03-orchestration-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

const bridgeGate = spawnSync('npm', ['run', 'quality:evolab-bridge-gate'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});
if (bridgeGate.status !== 0) process.exit(1);

const openclawGate = spawnSync('npm', ['run', 'quality:openclaw-gate'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});
if (openclawGate.status !== 0) process.exit(1);

const cycleGate = spawnSync('npm', ['run', 'quality:openclaw-cycle-gate'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});
if (cycleGate.status !== 0) process.exit(1);

console.log('pm03-orchestration-gate OK — EPIS2-PM-03');
