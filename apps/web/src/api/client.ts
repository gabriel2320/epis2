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
    /** Código estable del envelope (`apiErrorSchema`), p. ej. NOT_FOUND. */
    public code?: string,
    /** Id de correlación para buscar el error en los logs de la API. */
    public correlationId?: string,
    /** Detalle por campo (paths Zod) para mapear a formularios (MF-NORM-404). */
    public details?: Array<{ path: string; message: string }>,
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
    let code: string | undefined;
    let correlationId: string | undefined;
    let details: Array<{ path: string; message: string }> | undefined;
    try {
      // Envelope compartido de la API (MF-NORM-202): { code, message, correlationId, details? }.
      const body = (await res.json()) as {
        message?: string;
        code?: string;
        correlationId?: string;
        details?: Array<{ path: string; message: string }>;
      };
      if (body.message) message = body.message;
      code = body.code;
      correlationId = body.correlationId;
      details = body.details;
    } catch {
      /* ignore */
    }
    if (res.status === 401 && shouldRedirectOn401()) {
      redirectToSessionExpired();
    }
    throw new ApiError(message, res.status, code, correlationId, details);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}
