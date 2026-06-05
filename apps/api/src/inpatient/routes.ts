import {
  inpatientAdmissionCreateResponseSchema,
  inpatientAdmissionCreateSchema,
  inpatientDischargeResponseSchema,
  inpatientTransferResponseSchema,
  inpatientTransferSchema,
} from '@epis2/contracts';
import type { FastifyInstance } from 'fastify';
import { appendAudit } from '../audit/store.js';
import type { AppConfig } from '../config.js';
import type { Database } from '../db/client.js';
import {
  createRequirePermission,
  type AuthenticatedRequest,
} from '../auth/authenticate.js';
import {
  createInpatientAdmission,
  dischargeInpatientAdmission,
  transferInpatientAdmission,
} from './admissions.js';
import { acknowledgeCriticalResult } from './service.js';

export async function registerInpatientRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  if (!db) return;

  const requirePatientRead = createRequirePermission(config, 'patient.read');
  const requireDraftWrite = createRequirePermission(config, 'draft.write');

  app.post(
    '/api/inpatient/critical-results/:criticalId/acknowledge',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      const { criticalId } = request.params as { criticalId: string };
      const session = (request as AuthenticatedRequest).session;

      const updated = await acknowledgeCriticalResult(db, criticalId, session.sub);
      if (!updated) {
        return reply.status(404).send({ error: 'Resultado crítico no encontrado' });
      }

      await appendAudit(db, {
        eventType: 'critical.acknowledged',
        actorId: session.sub,
        username: session.username,
        entityType: 'critical_result',
        entityId: criticalId,
        message: 'Acuse de resultado crítico (demo)',
        payload: { patientId: updated.patientId, label: updated.label },
      });

      return {
        id: criticalId,
        acknowledgedAt: updated.acknowledgedAt?.toISOString(),
        readOnly: true,
      };
    },
  );

  app.post(
    '/api/inpatient/admissions',
    { preHandler: requireDraftWrite },
    async (request, reply) => {
      const parsed = inpatientAdmissionCreateSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Ingreso hospitalario inválido' });
      }
      const session = (request as AuthenticatedRequest).session;
      try {
        const result = await createInpatientAdmission(db, {
          patientId: parsed.data.patientId,
          bedId: parsed.data.bedId,
          unitCode: parsed.data.unitCode,
          actorId: session.sub,
          username: session.username,
        });
        return reply.status(201).send(inpatientAdmissionCreateResponseSchema.parse(result));
      } catch (e) {
        return reply.status(409).send({
          error: e instanceof Error ? e.message : 'No se pudo admitir',
        });
      }
    },
  );

  app.post(
    '/api/inpatient/admissions/:admissionId/transfer',
    { preHandler: requireDraftWrite },
    async (request, reply) => {
      const { admissionId } = request.params as { admissionId: string };
      const parsed = inpatientTransferSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Traslado inválido' });
      }
      const session = (request as AuthenticatedRequest).session;
      try {
        const result = await transferInpatientAdmission(
          db,
          admissionId,
          parsed.data.targetBedId,
          { id: session.sub, username: session.username },
        );
        return inpatientTransferResponseSchema.parse(result);
      } catch (e) {
        return reply.status(409).send({
          error: e instanceof Error ? e.message : 'No se pudo trasladar',
        });
      }
    },
  );

  app.post(
    '/api/inpatient/admissions/:admissionId/discharge',
    { preHandler: requireDraftWrite },
    async (request, reply) => {
      const { admissionId } = request.params as { admissionId: string };
      const session = (request as AuthenticatedRequest).session;
      try {
        const result = await dischargeInpatientAdmission(db, admissionId, {
          id: session.sub,
          username: session.username,
        });
        return inpatientDischargeResponseSchema.parse(result);
      } catch (e) {
        return reply.status(409).send({
          error: e instanceof Error ? e.message : 'No se pudo dar de alta',
        });
      }
    },
  );
}
