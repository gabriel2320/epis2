#!/usr/bin/env node
/**
 * Microfases READY por frente — PROG-EXPERIENCIA-CORE-2026.
 *   npm run quality:tres-frentes-next
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const ledgerPath = join(root, 'docs/quality/tres-frentes-ledger.json');

const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));

const readyByFront = ledger.fronts.map((front) => {
  const ready = ledger.phases.find((p) => p.front === front.id && p.state === 'READY');
  const inProgress = ledger.phases.find((p) => p.front === front.id && p.state === 'IN_PROGRESS');
  const active = inProgress ?? ready;
  return {
    front: front.id,
    program: front.program,
    name: front.name,
    active: active
      ? {
          id: active.id,
          name: active.name,
          state: active.state,
          gate: active.gate,
          allowedPaths: active.allowedPaths,
          closureReport: active.closureReport,
        }
      : null,
  };
});

const done = ledger.phases.filter((p) => p.state === 'DONE').length;
const total = ledger.phases.length;

const signoffReady =
  ledger.signoff.requires.every((id) => ledger.phases.find((p) => p.id === id)?.state === 'DONE');

console.log(
  JSON.stringify(
    {
      program: ledger.program,
      strategy: ledger.strategy,
      progress: `${done}/${total}`,
      plan: ledger.canonicalPlan,
      readyByFront,
      signoff: signoffReady
        ? { status: 'READY', gate: ledger.signoff.gate }
        : { status: 'PENDING', requires: ledger.signoff.requires },
      pausedPrograms: ledger.blockedUntilSignoff,
    },
    null,
    2,
  ),
);

const anyActive = readyByFront.some((f) => f.active);
if (!anyActive && !signoffReady) {
  console.error('No hay microfase READY/IN_PROGRESS en ningún frente.');
  process.exit(1);
}
