/**
 * EPIS2 auto-dev 6h ledger — resumen y guardas anti-bucle vacío.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const AUTO_DEV_LEDGER_REL = 'docs/quality/auto-dev-6h-ledger.json';

export function loadAutoDevLedger(root) {
  return JSON.parse(readFileSync(join(root, AUTO_DEV_LEDGER_REL), 'utf8'));
}

/** Tramos que el orquestador ejecutaría en este ciclo. */
export function countOrchestratorRunnable(ledger, { resume = true, retryFailed = false } = {}) {
  let n = 0;
  for (const t of ledger.tramos ?? []) {
    if (resume && t.state === 'DONE') continue;
    if (t.state === 'FAILED' && !retryFailed) continue;
    n += 1;
  }
  return n;
}

export function isLedgerCycleComplete(ledger, { retryFailed = false } = {}) {
  return countOrchestratorRunnable(ledger, { resume: true, retryFailed }) === 0;
}

export function countPendingOrFailed(ledger) {
  return (ledger.tramos ?? []).filter((t) => t.state === 'PENDING' || t.state === 'FAILED').length;
}

export function summarizeLedger(ledger, { resume = true, retryFailed = false } = {}) {
  const counts = { PENDING: 0, RUNNING: 0, DONE: 0, FAILED: 0 };
  for (const t of ledger.tramos ?? []) {
    counts[t.state] = (counts[t.state] ?? 0) + 1;
  }
  return {
    counts,
    runnable: countOrchestratorRunnable(ledger, { resume, retryFailed }),
    pendingOrFailed: countPendingOrFailed(ledger),
    complete: isLedgerCycleComplete(ledger, { retryFailed }),
  };
}
