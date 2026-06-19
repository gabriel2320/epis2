import { opsStatusResponseSchema } from '@epis2/contracts';
import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config.js';
import { sendApiError } from '../errors.js';
import type { Database } from '../db/client.js';
import { createRequirePermission, type AuthenticatedRequest } from '../auth/authenticate.js';
import { runWithRlsContext } from '../db/rlsContext.js';
import { getOpsStatus } from './service.js';

export async function registerOpsRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  const requireAuditRead = createRequirePermission(config, 'audit.read');

  app.get('/api/ops/status', { preHandler: requireAuditRead }, async (_request, reply) => {
    if (!db) {
      return sendApiError(reply, 503, 'Base de datos no disponible');
    }
    const session = (_request as AuthenticatedRequest).session;
    const status = await runWithRlsContext(db, config, session, (tx) => getOpsStatus(tx, config));
    const { aiRunsTotal, ...body } = status;
    void aiRunsTotal;
    return opsStatusResponseSchema.parse(body);
  });
}
