#!/usr/bin/env node
import {
  loadDualChartLedger,
  validateDualChartLedger,
  DUAL_CHART_LEDGER_PATH,
} from './dual-chart-ledger-lib.mjs';

console.log('EPIS2 quality:dual-chart-ledger\n');
console.log(`Ledger: ${DUAL_CHART_LEDGER_PATH}\n`);

const ledger = loadDualChartLedger();
const result = validateDualChartLedger(ledger);

for (const w of result.warnings) {
  console.warn(`[WARN] ${w}`);
}

if (!result.ok) {
  for (const e of result.errors) {
    console.error(`[FAIL] ${e}`);
  }
  console.error('\nquality:dual-chart-ledger FAILED');
  process.exit(1);
}

console.log(`[OK] Ledger válido — ${ledger.phases.length} fases PROG-DUAL-CHART`);
if (result.ready) {
  console.log(`[OK] Próxima READY: ${result.ready.id} — ${result.ready.name}`);
} else if (result.inProgress) {
  console.log(`[OK] En progreso: ${result.inProgress.id} — ${result.inProgress.name}`);
} else {
  console.log('[OK] Programa PROG-DUAL-CHART completo');
}
console.log('\nquality:dual-chart-ledger OK');
