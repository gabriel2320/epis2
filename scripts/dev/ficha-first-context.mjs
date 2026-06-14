/**
 * PROG-FICHA-FIRST-2026 — lectura del ledger para agente / velocity.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** @param {string} root */
export function getFichaFirstActive(root) {
  const path = join(root, 'docs/quality/ficha-first-ledger.json');
  if (!existsSync(path)) return null;

  const ledger = JSON.parse(readFileSync(path, 'utf8'));
  if (ledger.executionStatus !== 'ACTIVE') return { program: ledger.program, paused: true };

  const phases = ledger.phases ?? [];
  const inProgress = phases.find((p) => p.state === 'IN_PROGRESS');
  const ready = phases.find((p) => p.state === 'READY');
  const next = inProgress ?? ready;
  const doneCount = phases.filter((p) => p.state === 'DONE').length;

  return {
    program: ledger.program,
    progress: `${doneCount}/${phases.length}`,
    active: next
      ? {
          id: next.id,
          name: next.name,
          state: next.state,
          gate: next.gate,
        }
      : null,
  };
}

/** @param {ReturnType<typeof getFichaFirstActive>} fichaFirst */
export function formatFichaFirstLine(fichaFirst) {
  if (!fichaFirst) return '- FICHA-FIRST: ledger no legible';
  if (fichaFirst.paused) return `- FICHA-FIRST: PAUSED (${fichaFirst.program})`;
  if (!fichaFirst.active) {
    return `- FICHA-FIRST: ${fichaFirst.program} · ${fichaFirst.progress} DONE`;
  }
  const { active } = fichaFirst;
  const gate = active.gate ? ` · gate \`${active.gate}\`` : '';
  return `- FICHA-FIRST ${active.state}: **${active.id}** — ${active.name}${gate}`;
}
