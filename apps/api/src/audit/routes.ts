import { auditEventsResponseSchema } from '@epis2/contracts';
import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config.js';
import type { Database } from '../db/client.js';
import { createRequirePermission } from '../auth/authenticate.js';
import { listRecentAuditEvents } from './store.js';

export async function registerAuditRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  const requireAuditRead = createRequirePermission(config, 'audit.read');

  app.get('/api/audit/events', { preHandler: requireAuditRead }, async (request) => {
    const limit = Math.min(
      200,
      Math.max(1, Number((request.query as { limit?: string }).limit) || 50),
    );
    const events = await listRecentAuditEvents(db, limit);
    return auditEventsResponseSchema.parse({ readOnly: true as const, events });
  });
}
