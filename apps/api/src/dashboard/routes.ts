import { dashboardWorkResponseSchema } from '@epis2/contracts';
import type { FastifyInstance } from 'fastify';
import { appendAudit } from '../audit/store.js';
import type { AppConfig } from '../config.js';
import type { Database } from '../db/client.js';
import {
  createRequirePermission,
  type AuthenticatedRequest,
} from '../auth/authenticate.js';
import { DEMO_WORK_TASKS, getDashboardWorkSummary } from './service.js';

export async function registerDashboardRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  const requireDashboardRead = createRequirePermission(config, 'dashboard.read');

  app.get(
    '/api/dashboard/work',
    { preHandler: requireDashboardRead },
    async (request) => {
      const session = (request as AuthenticatedRequest).session;

      await appendAudit(db, {
        eventType: 'dashboard.opened',
        actorId: session.sub,
        username: session.username,
        entityType: 'dashboard',
        entityId: 'work',
        message: 'Modo tablero — Mi trabajo',
        payload: { tab: 'work' },
      });

      if (!db) {
        return dashboardWorkResponseSchema.parse({
          readOnly: true,
          myOpenDrafts: [],
          pendingReview: [],
          demoTasks: [...DEMO_WORK_TASKS],
        });
      }

      const summary = await getDashboardWorkSummary(db, session.sub);
      return dashboardWorkResponseSchema.parse(summary);
    },
  );
}
