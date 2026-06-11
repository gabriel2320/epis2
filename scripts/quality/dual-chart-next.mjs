#!/usr/bin/env node
import { loadDualChartLedger, findNextDualChartPhase } from './dual-chart-ledger-lib.mjs';

const ledger = loadDualChartLedger();
const result = findNextDualChartPhase(ledger);

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
        program: 'PROG-DUAL-CHART',
        message: 'Todas las fases MF-DUAL-CHART-00…05 cerradas',
        plan: 'docs/product/EPIS2_DUAL_CHART_DEV_PLAN.md',
      },
      null,
      2,
    ),
  );
  process.exit(0);
}

console.log(
  JSON.stringify(
    {
      id: next.id,
      name: next.name,
      phase: next.phase,
      state: next.state,
      dependsOn: next.dependsOn,
      gate: next.gate,
      allowedPaths: next.allowedPaths,
      evidenceRequired: next.evidenceRequired,
      closureReport: next.closureReport,
      commands: {
        session: 'npm run dev:dual-chart:session',
        verify: `npm run quality:dual-chart-plan -- --phase ${next.phase}`,
        gate: `npm run ${next.gate.replace('quality:', 'quality:')}`,
      },
    },
    null,
    2,
  ),
);
