#!/usr/bin/env node
/**
 * Vista consolidada de ledgers activos (PROG-STRENGTHEN · PROG-DI · PROG-FICHA-FIRST).
 *   npm run quality:registry-status
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { findNextFichaFirstPhase, loadFichaFirstLedger } from './ficha-first-ledger-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

function loadLedger(rel) {
  return JSON.parse(readFileSync(join(root, rel), 'utf8'));
}

function countProgress(phases) {
  const doneCount = phases.filter((p) => p.state === 'DONE').length;
  const totalCount = phases.length;
  return { doneCount, totalCount, progress: `${doneCount}/${totalCount}` };
}

function findStrengthenNext(phases) {
  const ready = phases.find((p) => p.state === 'READY');
  const inProgress = phases.find((p) => p.state === 'IN_PROGRESS');
  return (
    inProgress ??
    ready ??
    phases.find(
      (p) =>
        p.state === 'BLOCKED' &&
        (p.dependsOn ?? []).every((dep) => {
          const d = phases.find((x) => x.id === dep);
          return d?.state === 'DONE';
        }),
    ) ??
    null
  );
}

const strengthen = loadLedger('docs/quality/strengthen-ledger.json');
const di = loadLedger('docs/quality/di-ledger.json');
const fichaFirst = loadFichaFirstLedger();
const fichaResult = findNextFichaFirstPhase(fichaFirst);

const strengthenCounts = countProgress(strengthen.phases);
const strengthenNext =
  strengthen.executionStatus === 'CLOSED' ? null : findStrengthenNext(strengthen.phases);
const diCounts = countProgress(di.phases);
const activeWave = (fichaFirst.waves ?? []).find((w) => w.state === 'ACTIVE') ?? null;

const strengthenClosed = strengthen.executionStatus === 'CLOSED';

const out = {
  generatedAt: new Date().toISOString(),
  iterationCommand: 'npm run dev:rapid',
  recommendedNext: strengthenClosed
    ? 'npm run quality:ficha-first-next'
    : 'npm run quality:strengthen-next',
  programs: {
    'PROG-STRENGTHEN': {
      program: strengthen.program,
      executionStatus: strengthen.executionStatus,
      strategy: strengthen.strategy,
      ...strengthenCounts,
      active: strengthenNext
        ? {
            id: strengthenNext.id,
            name: strengthenNext.name,
            subprogram: strengthenNext.subprogram,
            state: strengthenNext.state,
            gate: strengthenNext.gate ?? null,
            closureReport: strengthenNext.closureReport ?? null,
          }
        : null,
      closedSummary: strengthenClosed
        ? {
            closedAt: strengthen.closedAt ?? null,
            closeReport: strengthen.closeReport ?? null,
            allPhasesDone: strengthenCounts.doneCount === strengthenCounts.totalCount,
          }
        : undefined,
      futureProgram: strengthen.futureProgram?.id ?? null,
    },
    'PROG-DI': {
      program: di.program,
      executionStatus: di.executionStatus,
      strategy: di.strategy,
      ...diCounts,
      closedSummary: {
        conciliacionClosedAt: di.conciliacionClosedAt ?? null,
        closeReport: di.conciliacionCloseReport ?? null,
        gitCommittedAt: di.gitCommittedAt ?? null,
        prerequisiteMet: di.prerequisiteMet ?? null,
        allPhasesDone: diCounts.doneCount === diCounts.totalCount,
      },
    },
    'PROG-FICHA-FIRST': {
      program: fichaFirst.program,
      executionStatus: fichaFirst.executionStatus,
      strategy: fichaFirst.strategy,
      progress: `${fichaResult.doneCount}/${fichaResult.total}`,
      doneCount: fichaResult.doneCount,
      totalCount: fichaResult.total,
      activeWave: activeWave?.id ?? null,
      wave1ClosedAt: fichaFirst.wave1ClosedAt ?? null,
      active: fichaResult.complete
        ? null
        : fichaResult.next
          ? {
              id: fichaResult.next.id,
              name: fichaResult.next.name,
              wave: fichaResult.next.wave ?? null,
              state: fichaResult.next.state,
              gate: fichaResult.next.gate ?? null,
              closureReport: fichaResult.next.closureReport ?? null,
            }
          : null,
      ledgerValid: fichaResult.ok,
    },
  },
};

console.log(JSON.stringify(out, null, 2));
