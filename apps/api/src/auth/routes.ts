import { findSyntheticUser, verifyDemoAuthKey } from '@epis2/clinical-domain';
import { loginRequestSchema, sessionResponseSchema } from '@epis2/contracts';
import type { FastifyInstance } from 'fastify';
import type { Database } from '../db/client.js';
import { appendAudit, listAuthAuditEvents } from '../audit/store.js';
import { type AppConfig, isDemoAuthEnabled, isDeployedEnv } from '../config.js';
import { sendApiError } from '../errors.js';
import {
  createAuthenticate,
  createRequirePermission,
  sessionToResponse,
  type AuthenticatedRequest,
} from './authenticate.js';
import { signSessionToken } from './sessionToken.js';
import { checkRateLimit } from '../security/rateLimit.js';

export async function registerAuthRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  const authenticate = createAuthenticate(config);
  const requireAuditRead = createRequirePermission(config, 'audit.read');

  app.post('/api/auth/login', async (request, reply) => {
    if (config.NODE_ENV !== 'test' && config.NODE_ENV !== 'development') {
      const clientIp = request.ip || 'unknown';
      const limit = checkRateLimit({
        key: `login:${clientIp}`,
        max: 20,
        windowMs: 15 * 60 * 1000,
      });
      if (!limit.allowed) {
        reply.header('retry-after', String(limit.retryAfterSec ?? 0));
        return sendApiError(
          reply,
          429,
          'Demasiados intentos de inicio de sesión. Intente más tarde.',
        );
      }
    }

    const body = loginRequestSchema.safeParse(request.body);
    if (!body.success) {
      return sendApiError(reply, 400, 'Datos de inicio de sesión inválidos');
    }

    if (!isDemoAuthEnabled(config)) {
      return sendApiError(
        reply,
        403,
        'Autenticación demo no disponible en este entorno. Configure un proveedor de identidad.',
      );
    }

    const user = findSyntheticUser(body.data.username);
    if (!user || !verifyDemoAuthKey(user, body.data.demoAuthKey)) {
      await appendAudit(db, {
        eventType: 'auth.login.failure',
        username: body.data.username,
        message: 'Credenciales demo inválidas',
      });
      return sendApiError(reply, 401, 'Usuario o clave demo incorrectos');
    }

    const { token, expiresAt } = await signSessionToken(
      {
        sub: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      },
      config.SESSION_SECRET,
    );

    reply.setCookie(config.SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: isDeployedEnv(config.NODE_ENV),
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    await appendAudit(db, {
      eventType: 'auth.login.success',
      actorId: user.id,
      username: user.username,
    });

    const response = sessionToResponse(
      {
        sub: user.id,
        username: user.username,
        displayName: user.displayName,
        role: user.role,
      },
      expiresAt,
    );
    return sessionResponseSchema.parse(response);
  });

  app.post('/api/auth/logout', { preHandler: authenticate }, async (request, reply) => {
    const session = (request as AuthenticatedRequest).session;
    await appendAudit(db, {
      eventType: 'auth.logout',
      actorId: session.sub,
      username: session.username,
    });
    reply.clearCookie(config.SESSION_COOKIE_NAME, { path: '/' });
    return { ok: true };
  });

  app.get('/api/auth/session', { preHandler: authenticate }, async (request) => {
    const session = (request as AuthenticatedRequest).session;
    const response = sessionToResponse(session, new Date(Date.now() + 3600_000).toISOString());
    return sessionResponseSchema.parse(response);
  });

  app.get('/api/auth/audit/login', { preHandler: requireAuditRead }, async (_request, reply) => {
    const events = await listAuthAuditEvents(db, 200);
    return reply.send({ events });
  });
}
