import { describe, expect, it } from 'vitest';
import { apiErrorSchema, defaultApiErrorCode } from './apiError.js';

describe('apiErrorSchema', () => {
  it('acepta un envelope mínimo válido', () => {
    const parsed = apiErrorSchema.safeParse({
      code: 'NOT_FOUND',
      message: 'Paciente no encontrado',
      correlationId: 'abc-123',
    });
    expect(parsed.success).toBe(true);
  });

  it('acepta details con paths Zod', () => {
    const parsed = apiErrorSchema.safeParse({
      code: 'VALIDATION',
      message: 'Datos de borrador inválidos',
      correlationId: 'abc-123',
      details: [{ path: 'patientId', message: 'Requerido' }],
    });
    expect(parsed.success).toBe(true);
  });

  it('rechaza envelope sin correlationId o con código desconocido', () => {
    expect(apiErrorSchema.safeParse({ code: 'NOT_FOUND', message: 'x' }).success).toBe(false);
    expect(
      apiErrorSchema.safeParse({
        code: 'WHATEVER',
        message: 'x',
        correlationId: 'abc',
      }).success,
    ).toBe(false);
  });

  it('rechaza el formato legacy { error }', () => {
    expect(apiErrorSchema.safeParse({ error: 'mensaje' }).success).toBe(false);
  });
});

describe('defaultApiErrorCode', () => {
  it('mapea status HTTP comunes a códigos estables', () => {
    expect(defaultApiErrorCode(400)).toBe('VALIDATION');
    expect(defaultApiErrorCode(401)).toBe('UNAUTHORIZED');
    expect(defaultApiErrorCode(403)).toBe('FORBIDDEN');
    expect(defaultApiErrorCode(404)).toBe('NOT_FOUND');
    expect(defaultApiErrorCode(409)).toBe('CONFLICT');
    expect(defaultApiErrorCode(429)).toBe('RATE_LIMITED');
    expect(defaultApiErrorCode(503)).toBe('UNAVAILABLE');
    expect(defaultApiErrorCode(500)).toBe('INTERNAL');
  });
});
