import { describe, expect, it } from 'vitest';
import { computeRutVerifier, formatRut, normalizeRut, validateRut } from './rut.js';

describe('RUT chileno (EPIS2)', () => {
  it('valida RUT conocido con formato puntos', () => {
    const r = validateRut('12.345.678-5');
    expect(r.valid).toBe(true);
    expect(r.normalized).toBe('12.345.678-5');
  });

  it('rechaza dígito verificador incorrecto', () => {
    const r = validateRut('12.345.678-0');
    expect(r.valid).toBe(false);
    expect(r.error).toMatch(/verificador/i);
  });

  it('normaliza entrada sin puntos', () => {
    expect(normalizeRut('123456785')).toBe('12.345.678-5');
  });

  it('acepta verificador K cuando corresponde', () => {
    let bodyWithK: string | null = null;
    for (let n = 1_000_000; n < 1_010_000 && !bodyWithK; n++) {
      const body = String(n);
      if (computeRutVerifier(body) === 'K') bodyWithK = body;
    }
    expect(bodyWithK).toBeTruthy();
    const verifier = computeRutVerifier(bodyWithK!);
    expect(validateRut(`${bodyWithK}${verifier}`).valid).toBe(true);
    expect(formatRut(bodyWithK!, verifier)).toMatch(/-K$/);
  });

  it('rechaza RUT vacío', () => {
    expect(validateRut('').valid).toBe(false);
  });
});
