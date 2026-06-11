import { describe, it, expect } from 'vitest';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  countOrchestratorRunnable,
  isLedgerCycleComplete,
  loadAutoDevLedger,
  summarizeLedger,
} from './auto-dev-ledger-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

describe('auto-dev ledger lib', () => {
  it('ledger canónico está completo — orquestador sin trabajo', () => {
    const ledger = loadAutoDevLedger(root);
    const summary = summarizeLedger(ledger);
    expect(summary.counts.DONE).toBe(ledger.tramos.length);
    expect(summary.runnable).toBe(0);
    expect(isLedgerCycleComplete(ledger)).toBe(true);
  });

  it('FAILED es runnable solo con retryFailed', () => {
    const ledger = {
      tramos: [
        { order: 0, id: 'H-AUTO-0', state: 'DONE' },
        { order: 1, id: 'H-AUTO-1', state: 'FAILED' },
      ],
    };
    expect(countOrchestratorRunnable(ledger)).toBe(0);
    expect(countOrchestratorRunnable(ledger, { retryFailed: true })).toBe(1);
    expect(isLedgerCycleComplete(ledger)).toBe(true);
    expect(isLedgerCycleComplete(ledger, { retryFailed: true })).toBe(false);
  });
});
