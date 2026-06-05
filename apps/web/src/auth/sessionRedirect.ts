const SESSION_EXPIRED_PATH = '/sesion-expirada';

let redirectingToSessionExpired = false;

/** Redirige a la pantalla de sesión expirada (idempotente). */
export function redirectToSessionExpired(): void {
  if (redirectingToSessionExpired) return;
  if (typeof globalThis.location === 'undefined') return;
  if (globalThis.location.pathname === SESSION_EXPIRED_PATH) return;

  redirectingToSessionExpired = true;
  const next = `${SESSION_EXPIRED_PATH}${globalThis.location.search}`;
  globalThis.location.assign(next);
}

export function resetSessionExpiredRedirectForTests(): void {
  redirectingToSessionExpired = false;
}
