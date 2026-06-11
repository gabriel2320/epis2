#!/usr/bin/env node
/** EPIS2 — gate puente Evolab (sin importar código del repo hermano). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'scripts/dev-agent/evolab-bridge.mjs',
  'scripts/dev-agent/evolab-sync.mjs',
  'scripts/dev-agent/openclaw-dev-cycle.mjs',
  'scripts/dev-agent/auto-dev-parallel-launcher.mjs',
  'scripts/dev-agent/start-auto-dev-integrated.ps1',
  'scripts/dev-agent/start-auto-dev-full-cycle.ps1',
  'docs/product/EPIS2_EVOLAB_INTEGRATION.md',
  'docs/product/EPIS2_DEV_CYCLE_OPENCLAW.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
for (const script of [
  'evolab:doctor',
  'evolab:smoke',
  'evolab:validate',
  'evolab:findings',
  'evolab:queue',
  'evolab:plan',
  'evolab:evolve',
  'evolab:stack',
  'dev:evolab:sync',
  'dev:auto:parallel',
  'quality:evolab-bridge-gate',
]) {
  if (!pkg.includes(`"${script}"`)) errors.push(`package.json sin ${script}`);
}

const bridge = readFileSync(join(root, 'scripts/dev-agent/evolab-bridge.mjs'), 'utf8');
for (const token of [
  'EPIS2_EVOLAB_ROOT',
  'EPIS2_EVOLAB_OPTIONAL',
  'EPIS2_ROOT',
  'resolveEvolabRoot',
  'plan',
  'evolve',
  'stack',
]) {
  if (!bridge.includes(token)) errors.push(`evolab-bridge sin ${token}`);
}

const parallel = readFileSync(
  join(root, 'scripts/dev-agent/auto-dev-parallel-launcher.mjs'),
  'utf8',
);
for (const token of [
  'EPIS2_EVOLAB_PATCHING_ENABLED',
  'EPIS2_EVOLAB_REQUIRE_HUMAN_APPROVAL',
  'EPIS2_EVOLAB_LLM_CONCURRENCY',
  'auto-dev-parallel-log.jsonl',
  'dev:evolab:sync',
  'evolab:validate',
]) {
  if (!parallel.includes(token)) errors.push(`parallel-launcher sin ${token}`);
}

const cycle = readFileSync(join(root, 'scripts/dev-agent/openclaw-dev-cycle.mjs'), 'utf8');
for (const token of [
  'EPIS2_AUTO_DEV_EVOLAB',
  'evolab:smoke',
  'evolab:validate',
  'evolab:doctor',
  'dev:evolab:sync',
]) {
  if (!cycle.includes(token)) errors.push(`openclaw-dev-cycle sin ${token}`);
}

const orch = readFileSync(join(root, 'scripts/dev-agent/auto-dev-orchestrator.mjs'), 'utf8');
if (!orch.includes('runTramoCycle')) errors.push('orchestrator sin runTramoCycle');

const pre = readFileSync(join(root, 'scripts/dev-agent/auto-dev-preconditions.mjs'), 'utf8');
if (!pre.includes('EPIS2_AUTO_DEV_EVOLAB')) errors.push('preconditions sin EPIS2_AUTO_DEV_EVOLAB');

const envEx = readFileSync(join(root, '.env.example'), 'utf8');
if (!envEx.includes('EPIS2_EVOLAB_ROOT')) errors.push('.env.example sin EPIS2_EVOLAB_ROOT');

const ledger = readFileSync(join(root, 'docs/quality/auto-dev-6h-ledger.json'), 'utf8');
for (const id of ['H-AUTO-2', 'H-AUTO-4', 'H-AUTO-6']) {
  if (!ledger.includes(id) || !ledger.includes('evolab'))
    errors.push(`ledger ${id} sin nota evolab`);
}

if (errors.length) {
  console.error('evolab-bridge-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('evolab-bridge-gate OK — puente Evolab PM-03');
