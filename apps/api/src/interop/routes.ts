import {
  hl7MappingPreviewSchema,
  hl7QuarantineIntakeResponseSchema,
  hl7QuarantineListResponseSchema,
  hl7RevertResponseSchema,
  hl7ValidateResponseSchema,
  hl7WritebackProposalResponseSchema,
  interopStagingResponseSchema,
} from '@epis2/contracts';
import { z } from 'zod';
import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config.js';
import { sendApiError } from '../errors.js';
import type { Database } from '../db/client.js';
import { createRequirePermission, type AuthenticatedRequest } from '../auth/authenticate.js';
import { validateHl7Message } from './hl7.js';
import { listInteropStagingBatches } from './staging.js';
import {
  getHl7MappingPreview,
  listHl7Quarantine,
  proposeHl7Writeback,
  revertHl7Quarantine,
  stageHl7Quarantine,
} from './quarantine.js';

const hl7BodySchema = z.object({ message: z.string().min(1) });

export async function registerInteropRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  const requireAuditRead = createRequirePermission(config, 'audit.read');

  app.get('/api/interop/staging', { preHandler: requireAuditRead }, async (_request, reply) => {
    if (!db) {
      return sendApiError(reply, 503, 'Base de datos no disponible');
    }
    const batches = await listInteropStagingBatches(db);
    return interopStagingResponseSchema.parse({ readOnly: true as const, batches });
  });

  app.get(
    '/api/interop/hl7/quarantine',
    { preHandler: requireAuditRead },
    async (_request, reply) => {
      if (!db) {
        return sendApiError(reply, 503, 'Base de datos no disponible');
      }
      const messages = await listHl7Quarantine(db);
      return hl7QuarantineListResponseSchema.parse({ readOnly: true as const, messages });
    },
  );

  app.post('/api/interop/hl7/validate', { preHandler: requireAuditRead }, async (request) => {
    const parsed = hl7BodySchema.safeParse(request.body);
    if (!parsed.success) {
      return hl7ValidateResponseSchema.parse({
        readOnly: true as const,
        valid: false,
        errors: ['Cuerpo inválido: se requiere { message }'],
      });
    }
    const result = validateHl7Message(parsed.data.message);
    return hl7ValidateResponseSchema.parse({
      readOnly: true as const,
      ...result,
    });
  });

  app.post(
    '/api/interop/hl7/quarantine',
    { preHandler: requireAuditRead },
    async (request, reply) => {
      if (!db) {
        return sendApiError(reply, 503, 'Base de datos no disponible');
      }
      const parsed = hl7BodySchema.safeParse(request.body);
      if (!parsed.success) {
        return sendApiError(reply, 400, 'Cuerpo inválido');
      }
      const session = (request as AuthenticatedRequest).session;
      try {
        const row = await stageHl7Quarantine(db, parsed.data.message, {
          id: session.sub,
          username: session.username,
        });
        return hl7QuarantineIntakeResponseSchema.parse({
          readOnly: true as const,
          quarantineId: row.id,
          messageType: row.messageType ?? undefined,
          status: 'quarantine' as const,
        });
      } catch (err) {
        return sendApiError(reply, 400, err instanceof Error ? err.message : 'HL7 inválido');
      }
    },
  );

  app.get(
    '/api/interop/hl7/quarantine/:quarantineId/mapping',
    { preHandler: requireAuditRead },
    async (request, reply) => {
      if (!db) {
        return sendApiError(reply, 503, 'Base de datos no disponible');
      }
      const { quarantineId } = request.params as { quarantineId: string };
      const preview = await getHl7MappingPreview(db, quarantineId);
      if (!preview) {
        return sendApiError(reply, 404, 'Cuarentena no encontrada');
      }
      return hl7MappingPreviewSchema.parse({ readOnly: true as const, ...preview });
    },
  );

  app.post(
    '/api/interop/hl7/quarantine/:quarantineId/propose-writeback',
    { preHandler: requireAuditRead },
    async (request, reply) => {
      if (!db) {
        return sendApiError(reply, 503, 'Base de datos no disponible');
      }
      const { quarantineId } = request.params as { quarantineId: string };
      const session = (request as AuthenticatedRequest).session;
      try {
        const { draft, preview } = await proposeHl7Writeback(db, quarantineId, {
          id: session.sub,
          username: session.username,
        });
        return hl7WritebackProposalResponseSchema.parse({
          readOnly: true as const,
          requiresHumanApproval: true as const,
          quarantineId,
          draft: {
            id: draft!.id,
            draftType: draft!.draftType,
            status: draft!.status,
            title: draft!.title,
          },
          preview,
        });
      } catch (err) {
        return sendApiError(
          reply,
          400,
          err instanceof Error ? err.message : 'No se pudo proponer writeback',
        );
      }
    },
  );

  app.post(
    '/api/interop/hl7/quarantine/:quarantineId/revert',
    { preHandler: requireAuditRead },
    async (request, reply) => {
      if (!db) {
        return sendApiError(reply, 503, 'Base de datos no disponible');
      }
      const { quarantineId } = request.params as { quarantineId: string };
      const session = (request as AuthenticatedRequest).session;
      try {
        const result = await revertHl7Quarantine(db, quarantineId, {
          id: session.sub,
          username: session.username,
        });
        return hl7RevertResponseSchema.parse({ readOnly: true as const, ...result });
      } catch (err) {
        return sendApiError(reply, 400, err instanceof Error ? err.message : 'No se pudo revertir');
      }
    },
  );
}
