#!/usr/bin/env node
/**
 * Gate compuesto PROG-DUAL-CHART — ledger + scaffold + gate de fase objetivo.
 *
 *   npm run quality:dual-chart-gate
 *   npm run quality:dual-chart-gate -- --phase 1
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadDualChartLedger, findNextDualChartPhase } from './dual-chart-ledger-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);

const PHASE_GATES = {
  0: 'validate-dual-chart-scaffold-gate.mjs',
  1: 'validate-dual-chart-traditional-gate.mjs',
  2: 'validate-dual-chart-paper-sot-gate.mjs',
  3: 'validate-dual-chart-router-gate.mjs',
  4: 'validate-dual-chart-shell-anatomy-gate.mjs',
  5: 'validate-dual-chart-traditional-layout-gate.mjs',
  6: 'validate-dual-chart-paper-layout-gate.mjs',
  7: 'validate-dual-chart-legacy-freeze-gate.mjs',
  8: 'validate-dual-chart-census-gate.mjs',
  9: 'validate-dual-chart-launcher-gate.mjs',
};

function argValue(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

function runScript(script) {
  process.stdout.write(`▶ ${script} … `);
  const result = spawnSync(process.execPath, [join(root, 'scripts/quality', script)], {
    stdio: 'pipe',
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    console.log('FAIL');
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    process.exit(result.status ?? 1);
  }
  console.log('OK');
}

const ledger = loadDualChartLedger();
const validation = findNextDualChartPhase(ledger);
if (!validation.ok) {
  console.error('dual-chart-gate: ledger inválido');
  for (const e of validation.errors) console.error(`  - ${e}`);
  process.exit(1);
}

const phaseArg = argValue('--phase');
const targetPhase =
  phaseArg !== undefined ? Number(phaseArg) : (validation.next?.phase ?? 0);

const phase = ledger.phases.find((p) => p.phase === targetPhase);
if (!phase) {
  console.error(`dual-chart-gate: fase ${targetPhase} desconocida`);
  process.exit(1);
}

console.log(`EPIS2 quality:dual-chart-gate — ${phase.id} (fase ${phase.phase})\n`);

runScript('validate-dual-chart-ledger.mjs');
if (targetPhase > 0) {
  runScript(PHASE_GATES[0]);
}
runScript(PHASE_GATES[targetPhase] ?? PHASE_GATES[0]);

console.log(`\nquality:dual-chart-gate OK — ${phase.id}`);
