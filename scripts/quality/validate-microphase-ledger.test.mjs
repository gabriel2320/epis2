import { describe, it, expect } from 'vitest';
import { loadLedger, validateLedger, findNextReady } from './microphase-ledger-lib.mjs';

describe('microphase ledger', () => {
  it('ledger canónico es válido y tiene exactamente una READY', () => {
    const ledger = loadLedger();
    const result = validateLedger(ledger);
    expect(result.ok, result.errors.join('\n')).toBe(true);
    expect(result.ready?.id).toBe('MF-163');
  });

  it('findNextReady devuelve MF-163 tras acuse en bandeja', () => {
    const result = findNextReady(loadLedger());
    expect(result.next?.id).toBe('MF-163');
    expect(result.next?.name).toContain('orden');
  });
});
