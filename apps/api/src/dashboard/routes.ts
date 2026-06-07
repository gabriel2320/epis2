import {
  dashboardWorkResponseSchema,
  emergencyDashboardResponseSchema,
  icuDashboardResponseSchema,
  orDashboardResponseSchema,
  nursingDashboardResponseSchema,
  patientDashboardResponseSchema,
  pharmacyDashboardResponseSchema,
  qualityDashboardResponseSchema,
  receptionDashboardResponseSchema,
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
import { getNursingDashboardSummary } from './nursing.js';
import { getPharmacyDashboardSummary } from './pharmacy.js';
import { getReceptionDashboardSummary } from './reception.js';
import { getEmergencyDashboardSummary } from './emergency.js';
import { getIcuDashboardSummary } from './icu.js';
import { getOrDashboardSummary } from './or.js';
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

      const summary = await getDashboardWorkSummary(db, session.sub, session.role);
      return dashboardWorkResponseSchema.parse(summary);
    },
  );

  app.get(
    '/api/dashboard/nursing',
    { preHandler: requireDashboardRead },
    async (request, reply) => {
      const session = (request as AuthenticatedRequest).session;
      if (session.role !== 'nurse' && session.role !== 'physician' && session.role !== 'admin') {
        return reply.status(403).send({ error: 'Tablero de enfermería no disponible para este rol' });
      }
      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
      }
      const summary = await getNursingDashboardSummary(db, session.sub);
      return nursingDashboardResponseSchema.parse(summary);
    },
  );

  app.get(
    '/api/dashboard/pharmacy',
    { preHandler: requireDashboardRead },
    async (request, reply) => {
      const session = (request as AuthenticatedRequest).session;
      if (
        session.role !== 'pharmacist' &&
        session.role !== 'physician' &&
        session.role !== 'admin'
      ) {
        return reply.status(403).send({ error: 'Tablero de farmacia no disponible para este rol' });
      }
      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
      }
      const summary = await getPharmacyDashboardSummary(db);
      return pharmacyDashboardResponseSchema.parse(summary);
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

  app.get(
    '/api/dashboard/reception',
    { preHandler: requireDashboardRead },
    async (request, reply) => {
      const session = (request as AuthenticatedRequest).session;
      if (session.role !== 'admin' && session.role !== 'nurse' && session.role !== 'physician') {
        return reply.status(403).send({ error: 'Tablero de recepción no disponible para este rol' });
      }

      await appendAudit(db, {
        eventType: 'dashboard.opened',
        actorId: session.sub,
        username: session.username,
        entityType: 'dashboard',
        entityId: 'reception',
        message: 'Modo tablero — recepción',
        payload: { tab: 'reception' },
      });

      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
      }

      const summary = await getReceptionDashboardSummary(db, session.role);
      return receptionDashboardResponseSchema.parse(summary);
    },
  );

  app.get(
    '/api/dashboard/emergency',
    { preHandler: requireDashboardRead },
    async (request, reply) => {
      const session = (request as AuthenticatedRequest).session;
      if (session.role !== 'admin' && session.role !== 'nurse' && session.role !== 'physician') {
        return reply.status(403).send({ error: 'Tablero de urgencias no disponible para este rol' });
      }

      await appendAudit(db, {
        eventType: 'dashboard.opened',
        actorId: session.sub,
        username: session.username,
        entityType: 'dashboard',
        entityId: 'emergency',
        message: 'Modo tablero — urgencias',
        payload: { tab: 'emergency' },
      });

      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
      }

      const summary = await getEmergencyDashboardSummary(db, session.role);
      return emergencyDashboardResponseSchema.parse(summary);
    },
  );

  app.get(
    '/api/dashboard/icu',
    { preHandler: requireDashboardRead },
    async (request, reply) => {
      const session = (request as AuthenticatedRequest).session;
      if (session.role !== 'admin' && session.role !== 'nurse' && session.role !== 'physician') {
        return reply.status(403).send({ error: 'Tablero UCI no disponible para este rol' });
      }

      await appendAudit(db, {
        eventType: 'dashboard.opened',
        actorId: session.sub,
        username: session.username,
        entityType: 'dashboard',
        entityId: 'icu',
        message: 'Modo tablero — UCI',
        payload: { tab: 'icu' },
      });

      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
      }

      const summary = await getIcuDashboardSummary(db, session.role);
      return icuDashboardResponseSchema.parse(summary);
    },
  );

  app.get(
    '/api/dashboard/or',
    { preHandler: requireDashboardRead },
    async (request, reply) => {
      const session = (request as AuthenticatedRequest).session;
      if (session.role !== 'admin' && session.role !== 'nurse' && session.role !== 'physician') {
        return reply.status(403).send({ error: 'Tablero pabellón no disponible para este rol' });
      }

      await appendAudit(db, {
        eventType: 'dashboard.opened',
        actorId: session.sub,
        username: session.username,
        entityType: 'dashboard',
        entityId: 'or',
        message: 'Modo tablero — pabellón',
        payload: { tab: 'or' },
      });

      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
      }

      const summary = await getOrDashboardSummary(db, session.role);
      return orDashboardResponseSchema.parse(summary);
    },
  );
}
