import { describe, expect, it } from 'vitest';
import { DEFAULT_RUN_IDENTIFIER_TYPE, isChilePatientIdentifierType } from './identifier-types.js';
import { parseRutParts } from './rut-parts.js';

describe('Chile patient identifiers', () => {
  it('acepta tipos MINSAL del subset EPIS2', () => {
    expect(isChilePatientIdentifierType('RUN')).toBe(true);
    expect(isChilePatientIdentifierType('RUN_PROVISIONAL')).toBe(true);
    expect(isChilePatientIdentifierType('PASSPORT')).toBe(true);
    expect(isChilePatientIdentifierType('INVALID')).toBe(false);
  });

  it('parseRutParts descompone número y DV', () => {
    const parts = parseRutParts('12.345.678-5');
    expect(parts).toEqual({
      rutNumero: 12345678,
      rutDv: '5',
      normalized: '12.345.678-5',
    });
  });

  it('default RUN type', () => {
    expect(DEFAULT_RUN_IDENTIFIER_TYPE).toBe('RUN');
  });
});
