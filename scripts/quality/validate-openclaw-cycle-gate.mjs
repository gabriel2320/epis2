#!/usr/bin/env node
/** EPIS2 — gate ciclo dev OpenClaw + Ollama + Evolab. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'scripts/dev-agent/openclaw-dev-cycle.mjs',
  'scripts/dev-agent/openclaw-dev-cycle-launcher.mjs',
  'scripts/dev-agent/auto-dev-session-lock.mjs',
  'scripts/dev-agent/auto-dev-ledger-lib.mjs',
  'scripts/dev-agent/dev-cycle-sync.mjs',
  'docs/product/EPIS2_DEV_CYCLE_OPENCLAW.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
for (const script of ['dev:auto:cycle', 'dev:cycle:sync', 'quality:openclaw-cycle-gate']) {
  if (!pkg.includes(`"${script}"`)) errors.push(`package.json sin ${script}`);
}

const lockMod = readFileSync(join(root, 'scripts/dev-agent/auto-dev-session-lock.mjs'), 'utf8');
for (const token of ['acquireSessionLock', 'readActiveLock', 'exitIfSessionActive', "flag: 'wx'"]) {
  if (!lockMod.includes(token)) errors.push(`auto-dev-session-lock sin ${token}`);
}

const parallel = readFileSync(
  join(root, 'scripts/dev-agent/auto-dev-parallel-launcher.mjs'),
  'utf8',
);
if (!parallel.includes('auto-dev-session-lock')) errors.push('parallel-launcher sin session-lock');

const cycleLauncher = readFileSync(
  join(root, 'scripts/dev-agent/openclaw-dev-cycle-launcher.mjs'),
  'utf8',
);
if (!cycleLauncher.includes('exitIfSessionActive'))
  errors.push('cycle-launcher sin exitIfSessionActive');

const cycle = readFileSync(join(root, 'scripts/dev-agent/openclaw-dev-cycle.mjs'), 'utf8');
for (const token of ['runCycleBootstrap', 'runTramoCycle', 'runCycleClose', 'applyDevCycleEnv']) {
  if (!cycle.includes(token)) errors.push(`openclaw-dev-cycle sin ${token}`);
}

const orch = readFileSync(join(root, 'scripts/dev-agent/auto-dev-orchestrator.mjs'), 'utf8');
if (!orch.includes('runTramoCycle')) errors.push('orchestrator no delega en runTramoCycle');
if (!orch.includes('orchestrator-idle-skip'))
  errors.push('orchestrator sin guard anti-bucle vacío');

const continuous = readFileSync(join(root, 'scripts/dev-agent/auto-dev-continuous.mjs'), 'utf8');
if (!continuous.includes('continuous-idle-exit'))
  errors.push('continuous sin guard anti-bucle vacío');

const ledgerLib = readFileSync(join(root, 'scripts/dev-agent/auto-dev-ledger-lib.mjs'), 'utf8');
if (!ledgerLib.includes('countOrchestratorRunnable')) errors.push('auto-dev-ledger-lib incompleto');

const handoff = readFileSync(join(root, 'scripts/dev-agent/openclaw-handoff.mjs'), 'utf8');
if (!handoff.includes('evolab-open-findings')) errors.push('handoff sin Evolab findings');

const ps1 = join(root, 'scripts/dev-agent/start-auto-dev-full-cycle.ps1');
if (!existsSync(ps1)) errors.push('Falta start-auto-dev-full-cycle.ps1');
else {
  const txt = readFileSync(ps1, 'utf8');
  if (!txt.includes('dev:auto:cycle')) errors.push('full-cycle.ps1 sin dev:auto:cycle');
}

if (errors.length) {
  console.error('openclaw-cycle-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('openclaw-cycle-gate OK — ciclo OpenClaw+Ollama+Evolab');
