import { describe, expect, it, vi } from 'vitest';
import { ApiError } from '../api/client.js';
import { applyServerFieldErrors } from './applyServerFieldErrors.js';

const FIELD_IDS = ['encounterDate', 'evolutionNote', 'plan'] as const;

describe('applyServerFieldErrors (MF-NORM-404)', () => {
  it('aplica setError por campo para paths Zod con prefijo body.', () => {
    const setError = vi.fn();
    const error = new ApiError('Datos de borrador inválidos', 400, 'VALIDATION', 'cid-1', [
      { path: 'body.encounterDate', message: 'Fecha inválida' },
      { path: 'body.evolutionNote', message: 'Requerido' },
    ]);

    const applied = applyServerFieldErrors(error, FIELD_IDS, setError);

    expect(applied).toBe(2);
    expect(setError).toHaveBeenCalledWith('encounterDate', {
      type: 'server',
      message: 'Fecha inválida',
    });
    expect(setError).toHaveBeenCalledWith('evolutionNote', {
      type: 'server',
      message: 'Requerido',
    });
  });

  it('acepta paths sin prefijo y ignora campos desconocidos', () => {
    const setError = vi.fn();
    const error = new ApiError('Datos inválidos', 400, 'VALIDATION', 'cid-2', [
      { path: 'plan', message: 'Demasiado corto' },
      { path: 'patientId', message: 'UUID inválido' },
      { path: 'body.noEsCampo', message: 'x' },
    ]);

    const applied = applyServerFieldErrors(error, FIELD_IDS, setError);

    expect(applied).toBe(1);
    expect(setError).toHaveBeenCalledTimes(1);
    expect(setError).toHaveBeenCalledWith('plan', { type: 'server', message: 'Demasiado corto' });
  });

  it('no hace nada sin ApiError o sin details', () => {
    const setError = vi.fn();
    expect(applyServerFieldErrors(new Error('boom'), FIELD_IDS, setError)).toBe(0);
    expect(applyServerFieldErrors(new ApiError('sin details', 400), FIELD_IDS, setError)).toBe(0);
    expect(applyServerFieldErrors(undefined, FIELD_IDS, setError)).toBe(0);
    expect(setError).not.toHaveBeenCalled();
  });
});
