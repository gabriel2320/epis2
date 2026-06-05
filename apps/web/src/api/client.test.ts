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
        json: async () => ({ error: 'Sesión inválida' }),
      }),
    );

    await expect(apiFetch('/api/test')).rejects.toBeInstanceOf(ApiError);
    expect(assign).toHaveBeenCalledWith('/sesion-expirada');
  });
});
