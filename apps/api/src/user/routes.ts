import {
  bumpCatalogUsageRequestSchema,
  operationalMemoryResponseSchema,
  patchOperationalMemoryRequestSchema,
} from '@epis2/contracts';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import type { AuthenticatedRequest } from '../auth/authenticate.js';
import { createRequirePermission } from '../auth/authenticate.js';
import type { AppConfig } from '../config.js';
import type { Database } from '../db/client.js';
import { sendApiError } from '../errors.js';
import { bumpUserCatalogUsage } from './catalogUsage.js';
import {
  getOperationalMemoryForUser,
  patchOperationalMemoryForUser,
  touchRecentPatient,
} from './operationalMemory.js';

const patientIdParamsSchema = z.object({
  patientId: z.string().uuid(),
});

export async function registerUserRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  const requirePatientRead = createRequirePermission(config, 'patient.read');

  app.get(
    '/api/user/operational-memory',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      if (!db) return sendApiError(reply, 503, 'Base de datos no disponible');
      const session = (request as AuthenticatedRequest).session;
      const query = z.object({ patientId: z.string().uuid().optional() }).safeParse(request.query);
      if (!query.success) return sendApiError(reply, 400, 'Parámetros inválidos');
      const body = await getOperationalMemoryForUser(db, config, session, query.data.patientId);
      return operationalMemoryResponseSchema.parse(body);
    },
  );

  app.patch(
    '/api/user/operational-memory',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      if (!db) return sendApiError(reply, 503, 'Base de datos no disponible');
      const session = (request as AuthenticatedRequest).session;
      const query = z.object({ patientId: z.string().uuid().optional() }).safeParse(request.query);
      if (!query.success) return sendApiError(reply, 400, 'Parámetros inválidos');
      const patch = patchOperationalMemoryRequestSchema.safeParse(request.body);
      if (!patch.success) return sendApiError(reply, 400, 'Payload inválido');
      const body = await patchOperationalMemoryForUser(
        db,
        config,
        session,
        patch.data,
        query.data.patientId,
      );
      return operationalMemoryResponseSchema.parse(body);
    },
  );

  app.post(
    '/api/user/operational-memory/recent-patients',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      if (!db) return sendApiError(reply, 503, 'Base de datos no disponible');
      const session = (request as AuthenticatedRequest).session;
      const body = z
        .object({
          id: z.string().uuid(),
          displayName: z.string().min(1),
          demoCaseCode: z.string().optional(),
        })
        .safeParse(request.body);
      if (!body.success) return sendApiError(reply, 400, 'Paciente inválido');
      await touchRecentPatient(db, config, session, body.data);
      return { ok: true as const };
    },
  );

  app.get(
    '/api/user/operational-memory/patients/:patientId',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      if (!db) return sendApiError(reply, 503, 'Base de datos no disponible');
      const params = patientIdParamsSchema.safeParse(request.params);
      if (!params.success) return sendApiError(reply, 400, 'Paciente inválido');
      const session = (request as AuthenticatedRequest).session;
      const body = await getOperationalMemoryForUser(db, config, session, params.data.patientId);
      return operationalMemoryResponseSchema.parse(body);
    },
  );

  app.post(
    '/api/user/operational-memory/catalog-usage',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      if (!db) return sendApiError(reply, 503, 'Base de datos no disponible');
      const session = (request as AuthenticatedRequest).session;
      const body = bumpCatalogUsageRequestSchema.safeParse(request.body);
      if (!body.success) return sendApiError(reply, 400, 'Uso de catálogo inválido');
      const catalogUsage = await bumpUserCatalogUsage(
        db,
        config,
        session,
        body.data.domain,
        body.data.key,
      );
      return { ok: true as const, catalogUsage };
    },
  );
}
