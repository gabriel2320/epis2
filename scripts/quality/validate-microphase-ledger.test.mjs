import { describe, it, expect } from 'vitest';
import { loadLedger, validateLedger, findNextReady } from './microphase-ledger-lib.mjs';

describe('microphase ledger', () => {
  it('ledger canónico es válido — programa post-MVP completo', () => {
    const ledger = loadLedger();
    const result = validateLedger(ledger);
    expect(result.ok, result.errors.join('\n')).toBe(true);
    expect(result.ready).toBeNull();
    const done = ledger.microphases.filter((m) => m.state === 'DONE');
    expect(done.length).toBe(ledger.microphases.length);
  });

  it('findNextReady indica programa cerrado tras MF-182', () => {
    const result = findNextReady(loadLedger());
    expect(result.ok).toBe(true);
    expect(result.next).toBeNull();
  });
});
