#!/usr/bin/env node
/**
 * Siguiente microfase PROG-DETERMINISTIC-INTELLIGENCE-2026 (ledger JSON).
 *   npm run quality:di-next
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ledgerPath = join(root, 'docs/quality/di-ledger.json');

const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));

const ready = ledger.phases.find((p) => p.state === 'READY');
const inProgress = ledger.phases.find((p) => p.state === 'IN_PROGRESS');

const next =
  inProgress ??
  ready ??
  ledger.phases.find(
    (p) =>
      p.state === 'BLOCKED' &&
      p.dependsOn.every((dep) => {
        const d = ledger.phases.find((x) => x.id === dep);
        return d?.state === 'DONE';
      }),
  );

const doneCount = ledger.phases.filter((p) => p.state === 'DONE').length;
const totalCount = ledger.phases.length;

const out = {
  program: ledger.program,
  strategy: ledger.strategy,
  prerequisite: ledger.prerequisite,
  prerequisiteMet: ledger.prerequisiteMet,
  parallelWith: ledger.parallelWith,
  progress: `${doneCount}/${totalCount}`,
  active: next
    ? {
        id: next.id,
        name: next.name,
        subprogram: next.subprogram,
        state: next.state,
        gate: next.gate,
        allowedPaths: next.allowedPaths,
        recommendedAfter: next.recommendedAfter,
        closureReport: next.closureReport,
        plan: ledger.canonicalPlan,
      }
    : null,
  overlapWithStrengthen: ledger.overlapWithStrengthen,
  alreadyDone: ledger.alreadyDone,
};

console.log(JSON.stringify(out, null, 2));

if (!next) {
  console.error('No hay microfase READY/IN_PROGRESS/BLOCKED desbloqueada en PROG-DI-2026.');
  process.exit(1);
}
