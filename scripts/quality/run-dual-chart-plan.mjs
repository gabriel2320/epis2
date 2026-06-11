#!/usr/bin/env node
/**
 * Orquestador PROG-DUAL-CHART — ejecuta gates, tests y E2E por fase.
 *
 *   npm run quality:dual-chart-plan
 *   npm run quality:dual-chart-plan -- --phase 0
 *   npm run quality:dual-chart-plan -- --through 1
 *   npm run quality:dual-chart-plan -- --verify   # check + gate activo + unit chart
 *   npm run quality:dual-chart-plan -- --e2e      # incluye Playwright opt-in
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDualChartLedger, findNextDualChartPhase } from './dual-chart-ledger-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);

const PHASE_GATES = {
  0: 'dual-chart-scaffold-gate',
  1: 'dual-chart-traditional-gate',
  2: 'dual-chart-paper-sot-gate',
  3: 'dual-chart-router-gate',
  4: 'dual-chart-shell-anatomy-gate',
  5: 'dual-chart-traditional-layout-gate',
  6: 'dual-chart-paper-layout-gate',
  7: 'dual-chart-legacy-freeze-gate',
  8: 'dual-chart-census-gate',
  9: 'dual-chart-launcher-gate',
};

function hasFlag(flag) {
  return args.includes(flag);
}

function argValue(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

function npmRun(script, { required = true, env = {} } = {}) {
  process.stdout.write(`▶ npm run ${script} … `);
  const result = spawnSync('npm', ['run', script], {
    cwd: root,
    stdio: 'pipe',
    encoding: 'utf8',
    shell: true,
    env: { ...process.env, ...env },
  });
  const ok = result.status === 0;
  console.log(ok ? 'OK' : 'FAIL');
  if (!ok) {
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    if (required) process.exit(result.status ?? 1);
    console.warn(`⚠ opcional falló: ${script}`);
  }
  return ok;
}

const ledger = loadDualChartLedger();
const validation = findNextDualChartPhase(ledger);
if (!validation.ok) {
  console.error('dual-chart-plan: ledger inválido');
  for (const e of validation.errors) console.error(`  - ${e}`);
  process.exit(1);
}

const throughArg = argValue('--through');
const phaseArg = argValue('--phase');
const active = validation.next ?? validation.phases.find((p) => p.state === 'DONE');

let targetPhases;
if (phaseArg !== undefined) {
  targetPhases = [Number(phaseArg)];
} else if (throughArg !== undefined) {
  const n = Number(throughArg);
  targetPhases = ledger.phases.filter((p) => p.phase <= n).map((p) => p.phase);
} else {
  targetPhases = [active?.phase ?? 0];
}

console.log('EPIS2 quality:dual-chart-plan — PROG-DUAL-CHART\n');
console.log(`Fases objetivo: ${targetPhases.join(', ')}`);
if (active) {
  console.log(`Activa en ledger: ${active.id} (${active.state})\n`);
}

npmRun('quality:dual-chart-ledger');

if (hasFlag('--verify')) {
  npmRun('check');
}

for (const phaseNum of targetPhases) {
  const gate = PHASE_GATES[phaseNum];
  if (!gate) continue;
  npmRun(`quality:${gate}`);
}

if (hasFlag('--verify') || hasFlag('--unit')) {
  npmRun('test:unit:chart', { required: false });
}

if (hasFlag('--e2e')) {
  npmRun('test:e2e:dual-chart', {
    required: false,
    env: { VITE_ENABLE_DUAL_CHART_MODES: 'true' },
  });
}

if (hasFlag('--legacy')) {
  npmRun('test:e2e:three-modes', { required: false });
}

console.log('\n✓ quality:dual-chart-plan OK');
console.log('Siguiente: npm run dev:dual-chart:session');
