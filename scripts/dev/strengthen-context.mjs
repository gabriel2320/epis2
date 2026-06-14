/**
 * PROG-STRENGTHEN-2026 — lectura del ledger para agente / velocity.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** @param {string} root */
export function loadStrengthenLedger(root) {
  const path = join(root, 'docs/quality/strengthen-ledger.json');
  if (!existsSync(path)) return null;
  return JSON.parse(readFileSync(path, 'utf8'));
}

/** @param {string} root */
export function getStrengthenActive(root) {
  const ledger = loadStrengthenLedger(root);
  if (!ledger || ledger.executionStatus === 'PAUSED') {
    return ledger
      ? { paused: true, pauseReason: ledger.pauseReason, resumeWhen: ledger.resumeWhen }
      : null;
  }

  const phases = ledger.phases ?? [];
  const inProgress = phases.find((p) => p.state === 'IN_PROGRESS');
  const ready = phases.find((p) => p.state === 'READY');
  const next =
    inProgress ??
    ready ??
    phases.find(
      (p) =>
        p.state === 'BLOCKED' &&
        (p.dependsOn ?? []).every((dep) => phases.find((x) => x.id === dep)?.state === 'DONE'),
    );

  const doneCount = phases.filter((p) => p.state === 'DONE').length;

  if (!next) {
    return {
      program: ledger.program,
      progress: `${doneCount}/${phases.length}`,
      active: null,
    };
  }

  return {
    program: ledger.program,
    progress: `${doneCount}/${phases.length}`,
    active: {
      id: next.id,
      name: next.name,
      subprogram: next.subprogram,
      state: next.state,
      gate: next.gate,
      allowedPaths: next.allowedPaths ?? [],
      closureReport: next.closureReport,
    },
  };
}

/** @param {ReturnType<typeof getStrengthenActive>} strengthen */
export function formatStrengthenLine(strengthen) {
  if (!strengthen) return '- STRENGTHEN: ledger no legible';
  if (strengthen.paused) {
    return `- STRENGTHEN: PAUSED — ${strengthen.pauseReason ?? 'ver ledger'}`;
  }
  if (!strengthen.active) {
    return `- STRENGTHEN: ${strengthen.program} · ${strengthen.progress} DONE`;
  }
  const { active } = strengthen;
  const gate = active.gate ? ` · gate \`${active.gate}\`` : '';
  return `- STRENGTHEN ${active.state}: **${active.id}** — ${active.name}${gate}`;
}
