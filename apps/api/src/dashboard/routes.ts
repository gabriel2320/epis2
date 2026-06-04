import {
  dashboardWorkResponseSchema,
  patientDashboardResponseSchema,
  qualityDashboardResponseSchema,
  serviceDashboardResponseSchema,
} from '@epis2/contracts';
import type { FastifyInstance } from 'fastify';
import { appendAudit } from '../audit/store.js';
import type { AppConfig } from '../config.js';
import type { Database } from '../db/client.js';
import {
  createRequirePermission,
  type AuthenticatedRequest,
} from '../auth/authenticate.js';
import { getPatientById } from '../clinical/service.js';
import { getPatientDashboardSummary } from '../clinical/longitudinal.js';
import { getServiceDashboardSummary } from '../inpatient/service.js';
import { getQualityDashboardSummary } from './quality.js';
import { DEMO_WORK_TASKS, getDashboardWorkSummary } from './service.js';

export async function registerDashboardRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  const requireDashboardRead = createRequirePermission(config, 'dashboard.read');
  const requireAuditRead = createRequirePermission(config, 'audit.read');

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

  app.get(
    '/api/dashboard/patient/:patientId',
    { preHandler: requireDashboardRead },
    async (request, reply) => {
      const { patientId } = request.params as { patientId: string };
      const session = (request as AuthenticatedRequest).session;

      await appendAudit(db, {
        eventType: 'dashboard.opened',
        actorId: session.sub,
        username: session.username,
        entityType: 'dashboard',
        entityId: patientId,
        message: 'Modo tablero — paciente',
        payload: { tab: 'patient' },
      });

      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
      }

      const patient = await getPatientById(db, patientId);
      if (!patient) {
        return reply.status(404).send({ error: 'Paciente no encontrado' });
      }

      const summary = await getPatientDashboardSummary(db, patientId, patient.displayName);
      return patientDashboardResponseSchema.parse(summary);
    },
  );

  app.get(
    '/api/dashboard/service',
    { preHandler: requireDashboardRead },
    async (request, reply) => {
      const session = (request as AuthenticatedRequest).session;
      const unitCode = (request.query as { unit?: string }).unit;

      await appendAudit(db, {
        eventType: 'dashboard.opened',
        actorId: session.sub,
        username: session.username,
        entityType: 'dashboard',
        entityId: 'service',
        message: 'Modo tablero — servicio',
        payload: { tab: 'service', unit: unitCode },
      });

      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
      }

      const summary = await getServiceDashboardSummary(db, unitCode);
      return serviceDashboardResponseSchema.parse(summary);
    },
  );

  app.get(
    '/api/dashboard/quality',
    { preHandler: requireAuditRead },
    async (request, reply) => {
      const session = (request as AuthenticatedRequest).session;

      await appendAudit(db, {
        eventType: 'dashboard.opened',
        actorId: session.sub,
        username: session.username,
        entityType: 'dashboard',
        entityId: 'quality',
        message: 'Modo tablero — calidad',
        payload: { tab: 'quality' },
      });

      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
      }

      const summary = await getQualityDashboardSummary(db);
      return qualityDashboardResponseSchema.parse(summary);
    },
  );
}
