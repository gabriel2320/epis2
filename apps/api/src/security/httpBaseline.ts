import type { FastifyCorsOptions } from '@fastify/cors';
import type { CookieSerializeOptions } from '@fastify/cookie';
import type { AppConfig } from '../config.js';
import { isDeployedEnv } from '../config.js';

/** CSP mínima para API JSON (MF-CON-06). */
export const API_CONTENT_SECURITY_POLICY = "default-src 'none'; frame-ancestors 'none'";

/** HSTS solo en entornos desplegados (HTTPS asumido detrás de proxy). */
export const DEPLOYED_HSTS = 'max-age=31536000; includeSubDomains';

export function sessionCookieOptions(config: AppConfig): CookieSerializeOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: isDeployedEnv(config.NODE_ENV),
    path: '/',
  };
}

export function clearSessionCookieOptions(config: AppConfig): CookieSerializeOptions {
  return {
    path: '/',
    secure: isDeployedEnv(config.NODE_ENV),
    sameSite: 'lax',
  };
}

export function buildCorsOptions(config: AppConfig): FastifyCorsOptions {
  const base: FastifyCorsOptions = {
    origin: config.WEB_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-Id', 'X-Service-Api-Key'],
  };
  if (isDeployedEnv(config.NODE_ENV)) {
    return { ...base, maxAge: 600 };
  }
  return base;
}

export function securityHeaderValues(config: AppConfig): Record<string, string> {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': API_CONTENT_SECURITY_POLICY,
  };
  if (isDeployedEnv(config.NODE_ENV)) {
    headers['Strict-Transport-Security'] = DEPLOYED_HSTS;
  }
  return headers;
}
