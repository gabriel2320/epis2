import { redirectToSessionExpired } from '../auth/sessionRedirect.js';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

/** Rutas públicas donde 401 es esperado y no debe redirigir a sesión expirada (MF-185). */
const AUTH_PUBLIC_PATHS = ['/login', '/sesion-expirada'];

function shouldRedirectOn401(): boolean {
  if (typeof globalThis.location === 'undefined') return true;
  const path = globalThis.location.pathname;
  return !AUTH_PUBLIC_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      /* ignore */
    }
    if (res.status === 401 && shouldRedirectOn401()) {
      redirectToSessionExpired();
    }
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
