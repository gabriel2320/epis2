import { describe, expect, it } from 'vitest';
import { parseRlsMode } from './rls.js';

describe('runWithRlsContext (smoke)', () => {
  it('parseRlsMode off evita transacción RLS', () => {
    expect(parseRlsMode('off')).toBe('off');
    expect(parseRlsMode(undefined)).toBe('off');
  });

  it('parseRlsMode enforce activa políticas', () => {
    expect(parseRlsMode('enforce')).toBe('enforce');
  });
});
