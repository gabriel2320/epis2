#!/usr/bin/env node
import { loadLedger, validateLedger, LEDGER_PATH } from './microphase-ledger-lib.mjs';

console.log('EPIS2 quality:microphases\n');
console.log(`Ledger: ${LEDGER_PATH}\n`);

const ledger = loadLedger();
const result = validateLedger(ledger);

for (const w of result.warnings) {
  console.warn(`[WARN] ${w}`);
}

if (!result.ok) {
  for (const e of result.errors) {
    console.error(`[FAIL] ${e}`);
  }
  console.error('\nquality:microphases FAILED');
  process.exit(1);
}

const ready = result.ready;
console.log(`[OK] Ledger válido — ${ledger.microphases.length} microfases`);
console.log(`[OK] Próxima READY: ${ready.id} — ${ready.name}`);
console.log('\nquality:microphases OK');
