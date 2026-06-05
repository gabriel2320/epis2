/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { redirectToSessionExpired, resetSessionExpiredRedirectForTests } from './sessionRedirect.js';

describe('redirectToSessionExpired', () => {
  afterEach(() => {
    resetSessionExpiredRedirectForTests();
    vi.unstubAllGlobals();
  });

  it('navega una sola vez a /sesion-expirada', () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { pathname: '/comando', search: '?x=1', assign });

    redirectToSessionExpired();
    redirectToSessionExpired();

    expect(assign).toHaveBeenCalledTimes(1);
    expect(assign).toHaveBeenCalledWith('/sesion-expirada?x=1');
  });

  it('no redirige si ya está en sesión expirada', () => {
    const assign = vi.fn();
    vi.stubGlobal('location', { pathname: '/sesion-expirada', search: '', assign });

    redirectToSessionExpired();

    expect(assign).not.toHaveBeenCalled();
  });
});
