import { describe, it, expect } from 'vitest';
import { loadLedger, validateLedger, findNextReady } from './microphase-ledger-lib.mjs';

describe('microphase ledger', () => {
  it('ledger canónico es válido y tiene exactamente una READY', () => {
    const ledger = loadLedger();
    const result = validateLedger(ledger);
    expect(result.ok, result.errors.join('\n')).toBe(true);
    expect(result.ready?.id).toBe('MF-153');
  });

  it('findNextReady devuelve MF-153 tras MF-152 DONE', () => {
    const result = findNextReady(loadLedger());
    expect(result.next?.id).toBe('MF-153');
    expect(result.next?.name).toContain('PostgreSQL');
  });
});
