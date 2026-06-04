import type { LoginRequest, SessionResponse } from '@epis2/contracts';
import { apiFetch } from '../api/client.js';

export function login(request: LoginRequest): Promise<SessionResponse> {
  return apiFetch<SessionResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

export function fetchSession(): Promise<SessionResponse> {
  return apiFetch<SessionResponse>('/api/auth/session');
}

export function logout(): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>('/api/auth/logout', { method: 'POST' });
}
