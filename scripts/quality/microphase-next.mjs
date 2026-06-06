#!/usr/bin/env node
import { loadLedger, findNextReady } from './microphase-ledger-lib.mjs';

const ledger = loadLedger();
const result = findNextReady(ledger);

if (!result.ok) {
  console.error('Ledger inválido:');
  for (const e of result.errors) console.error(`  - ${e}`);
  process.exit(1);
}

const next = result.next;
console.log(JSON.stringify({
  id: next.id,
  name: next.name,
  wave: next.wave,
  waveName: next.waveName,
  dependsOn: next.dependsOn,
  state: next.state,
  evidenceRequired: next.evidenceRequired,
}, null, 2));
