import { permissionsForRole, roleHasPermission } from '@epis2/clinical-domain';
import type { Permission } from '@epis2/clinical-domain';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { AppConfig } from '../config.js';
import { verifySessionToken, type SessionClaims } from './sessionToken.js';
import {
  PILOT_SERVICE_AUDITOR_SESSION,
  SERVICE_API_KEY_HEADER,
} from './serviceAccount.js';

export type AuthenticatedRequest = FastifyRequest & {
  session: SessionClaims;
};

function readToken(request: FastifyRequest, cookieName: string): string | undefined {
  const cookie = request.cookies[cookieName];
  if (typeof cookie === 'string' && cookie.length > 0) return cookie;
  const header = request.headers.authorization;
  if (typeof header === 'string' && header.startsWith('Bearer ')) {
    return header.slice(7);
  }
  return undefined;
}

function readServiceApiKey(request: FastifyRequest): string | undefined {
  const raw = request.headers[SERVICE_API_KEY_HEADER];
  if (typeof raw === 'string' && raw.length > 0) return raw;
  return undefined;
}

export function createAuthenticate(config: AppConfig) {
  return async function authenticate(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    if (
      config.AUTH_MODE === 'hybrid' &&
      config.SERVICE_API_KEY &&
      readServiceApiKey(request) === config.SERVICE_API_KEY
    ) {
      (request as AuthenticatedRequest).session = PILOT_SERVICE_AUDITOR_SESSION;
      return;
    }

    const token = readToken(request, config.SESSION_COOKIE_NAME);
    if (!token) {
      return reply.status(401).send({ error: 'No autenticado' });
    }
    const session = await verifySessionToken(token, config.SESSION_SECRET);
    if (!session) {
      return reply.status(401).send({ error: 'Sesión inválida o expirada' });
    }
    (request as AuthenticatedRequest).session = session;
  };
}

export function createRequirePermission(config: AppConfig, permission: Permission) {
  const authenticate = createAuthenticate(config);
  return async function requirePermission(
    request: FastifyRequest,
    reply: FastifyReply,
  ): Promise<void> {
    await authenticate(request, reply);
    if (reply.sent) return;
    const session = (request as AuthenticatedRequest).session;
    if (!roleHasPermission(session.role, permission)) {
      return reply.status(403).send({
        error: 'Sin permiso',
        permission,
      });
    }
  };
}

export function sessionToResponse(session: SessionClaims, expiresAt: string) {
  return {
    user: {
      id: session.sub,
      username: session.username,
      displayName: session.displayName,
      role: session.role,
    },
    permissions: [...permissionsForRole(session.role)],
    expiresAt,
  };
}
