import {
  hl7ValidateResponseSchema,
  interopStagingResponseSchema,
} from '@epis2/contracts';
import { z } from 'zod';
import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config.js';
import type { Database } from '../db/client.js';
import { createRequirePermission } from '../auth/authenticate.js';
import { validateHl7Message } from './hl7.js';
import { listInteropStagingBatches } from './staging.js';

const hl7BodySchema = z.object({ message: z.string().min(1) });

export async function registerInteropRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  const requireAuditRead = createRequirePermission(config, 'audit.read');

  app.get(
    '/api/interop/staging',
    { preHandler: requireAuditRead },
    async (_request, reply) => {
      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
      }
      const batches = await listInteropStagingBatches(db);
      return interopStagingResponseSchema.parse({ readOnly: true as const, batches });
    },
  );

  app.post(
    '/api/interop/hl7/validate',
    { preHandler: requireAuditRead },
    async (request) => {
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
    },
  );
}
