import { describe, expect, it } from 'vitest';
import { buildRlsSetLocalStatements, parseRlsMode } from './rls.js';

describe('RLS pilot (ADR-005)', () => {
  it('parseRlsMode solo acepta off o enforce', () => {
    expect(parseRlsMode(undefined)).toBe('off');
    expect(parseRlsMode('enforce')).toBe('enforce');
    expect(parseRlsMode('invalid')).toBe('off');
  });

  it('buildRlsSetLocalStatements incluye actor y rol', () => {
    const stmts = buildRlsSetLocalStatements({
      mode: 'enforce',
      actorId: 'usr-nurse-01',
      actorRole: 'nurse',
    });
    expect(stmts.join(' ')).toContain("epis2.rls_mode = 'enforce'");
    expect(stmts.join(' ')).toContain('usr-nurse-01');
    expect(stmts.join(' ')).toContain('nurse');
  });
});
