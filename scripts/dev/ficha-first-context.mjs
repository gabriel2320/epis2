/**
 * PROG-FICHA-FIRST-2026 — lectura del ledger para agente / velocity.
 */
import { join } from 'node:path';
import {
  findNextFichaFirstPhase,
  loadFichaFirstLedger,
} from '../quality/ficha-first-ledger-lib.mjs';

/** @param {string} root */
export function getFichaFirstActive(root) {
  const path = join(root, 'docs/quality/ficha-first-ledger.json');
  try {
    const ledger = loadFichaFirstLedger(path);
    const result = findNextFichaFirstPhase(ledger);

    if (!result.ok) {
      return { program: ledger.program, error: result.errors.join('; ') };
    }

    if (result.complete || ledger.executionStatus === 'CLOSED') {
      return {
        program: ledger.program,
        progress: `${result.doneCount}/${result.total}`,
        complete: true,
        wave1ClosedAt: ledger.wave1ClosedAt,
      };
    }

    return {
      program: ledger.program,
      progress: `${result.doneCount}/${result.total}`,
      active: result.next
        ? {
            id: result.next.id,
            name: result.next.name,
            state: result.next.state,
            wave: result.next.wave,
            gate: result.next.gate,
          }
        : null,
    };
  } catch {
    return null;
  }
}

/** @param {ReturnType<typeof getFichaFirstActive>} fichaFirst */
export function formatFichaFirstLine(fichaFirst) {
  if (!fichaFirst) return '- FICHA-FIRST: ledger no legible';
  if (fichaFirst.error) return `- FICHA-FIRST: ERROR — ${fichaFirst.error}`;
  if (fichaFirst.complete) {
    return `- FICHA-FIRST: ${fichaFirst.program} · ${fichaFirst.progress} DONE (programa cerrado)`;
  }
  if (!fichaFirst.active) {
    return `- FICHA-FIRST: ${fichaFirst.program} · ${fichaFirst.progress} DONE`;
  }
  const { active } = fichaFirst;
  const gate = active.gate ? ` · gate \`${active.gate}\`` : '';
  return `- FICHA-FIRST ${active.state}: **${active.id}** — ${active.name}${gate}`;
}
