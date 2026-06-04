import { opsStatusResponseSchema } from '@epis2/contracts';
import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config.js';
import type { Database } from '../db/client.js';
import { createRequirePermission } from '../auth/authenticate.js';
import { getOpsStatus } from './service.js';

export async function registerOpsRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  const requireAuditRead = createRequirePermission(config, 'audit.read');

  app.get(
    '/api/ops/status',
    { preHandler: requireAuditRead },
    async (_request, reply) => {
      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
      }
      const status = await getOpsStatus(db);
      const { aiRunsTotal: _ai, ...body } = status;
      return opsStatusResponseSchema.parse(body);
    },
  );
}
