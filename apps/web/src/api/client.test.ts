/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiFetch, ApiError } from './client.js';
import { resetSessionExpiredRedirectForTests } from '../auth/sessionRedirect.js';

describe('apiFetch', () => {
  afterEach(() => {
    resetSessionExpiredRedirectForTests();
    vi.restoreAllMocks();
  });

  it('redirige a sesión expirada ante 401', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { pathname: '/comando', search: '', assign });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({
          code: 'UNAUTHORIZED',
          message: 'Sesión inválida',
          correlationId: 'cid-1',
        }),
      }),
    );

    await expect(apiFetch('/api/test')).rejects.toBeInstanceOf(ApiError);
    expect(assign).toHaveBeenCalledWith('/sesion-expirada');
  });

  it('no redirige ante 401 en /login (MF-185)', async () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { pathname: '/login', search: '', assign });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: async () => ({
          code: 'UNAUTHORIZED',
          message: 'Sin sesión',
          correlationId: 'cid-2',
        }),
      }),
    );

    await expect(apiFetch('/api/auth/session')).rejects.toBeInstanceOf(ApiError);
    expect(assign).not.toHaveBeenCalled();
  });

  it('expone code, correlationId y details del envelope (MF-NORM-202)', async () => {
    vi.stubGlobal('location', { pathname: '/comando', search: '', assign: vi.fn() });

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({
          code: 'VALIDATION',
          message: 'Datos de borrador inválidos',
          correlationId: 'cid-3',
          details: [{ path: 'patientId', message: 'Requerido' }],
        }),
      }),
    );

    const error = await apiFetch('/api/drafts').catch((e: unknown) => e as ApiError);
    expect(error).toBeInstanceOf(ApiError);
    expect((error as ApiError).message).toBe('Datos de borrador inválidos');
    expect((error as ApiError).code).toBe('VALIDATION');
    expect((error as ApiError).correlationId).toBe('cid-3');
    expect((error as ApiError).details).toEqual([{ path: 'patientId', message: 'Requerido' }]);
  });
});
