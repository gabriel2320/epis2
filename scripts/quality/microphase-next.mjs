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
if (!next) {
  console.log(
    JSON.stringify(
      {
        status: 'complete',
        message: 'Sin microfases READY — programa post-MVP (MF-151→182) cerrado en ledger',
        nextStep: 'Ver docs/product/EPIS2_GLOBAL_DEV_PLAN.md Fase B',
      },
      null,
      2,
    ),
  );
  process.exit(0);
}
console.log(JSON.stringify({
  id: next.id,
  name: next.name,
  wave: next.wave,
  waveName: next.waveName,
  dependsOn: next.dependsOn,
  state: next.state,
  evidenceRequired: next.evidenceRequired,
}, null, 2));
