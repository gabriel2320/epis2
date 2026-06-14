#!/usr/bin/env node
import { loadFichaFirstLedger, findNextFichaFirstPhase } from './ficha-first-ledger-lib.mjs';

const ledger = loadFichaFirstLedger();
const result = findNextFichaFirstPhase(ledger);

if (!result.ok) {
  console.error('Ledger inválido:');
  for (const e of result.errors) console.error(`  - ${e}`);
  process.exit(1);
}

if (result.warnings?.length) {
  for (const w of result.warnings) console.warn(`  warn: ${w}`);
}

if (result.complete || !result.next) {
  console.log(
    JSON.stringify(
      {
        status: 'complete',
        program: ledger.program,
        progress: `${result.doneCount}/${result.total}`,
        message: 'Todas las fases MF-FF cerradas',
        plan: ledger.canonicalPlan ?? 'docs/product/EPIS2_FICHA_FIRST_DEV_PLAN.md',
        wave1ClosedAt: ledger.wave1ClosedAt,
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

const next = result.next;
console.log(
  JSON.stringify(
    {
      status: 'active',
      program: ledger.program,
      progress: `${result.doneCount}/${result.total}`,
      wave: next.wave,
      id: next.id,
      name: next.name,
      state: next.state,
      dependsOn: next.dependsOn ?? [],
      gate: next.gate,
      allowedPaths: next.allowedPaths ?? [],
      evidenceRequired: next.evidenceRequired ?? [],
      closureReport: next.closureReport,
      commands: {
        gate: next.gate?.startsWith('quality:') ? `npm run ${next.gate}` : `npm run ${next.gate}`,
        rapid: 'npm run dev:rapid',
        plan: ledger.canonicalPlan,
      },
    },
    null,
    2,
  ),
);
