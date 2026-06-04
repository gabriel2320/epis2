import type { FastifyInstance } from 'fastify';
import { appendAudit } from '../audit/store.js';
import type { AppConfig } from '../config.js';
import type { Database } from '../db/client.js';
import {
  createRequirePermission,
  type AuthenticatedRequest,
} from '../auth/authenticate.js';
import { acknowledgeCriticalResult } from './service.js';

export async function registerInpatientRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  if (!db) return;

  const requirePatientRead = createRequirePermission(config, 'patient.read');

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
}
