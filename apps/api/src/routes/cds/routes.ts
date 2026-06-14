import { mapClinicalAlertsToOrderSelectCards } from '@epis2/clinical-domain';
import { clinicalAlertSchema } from '@epis2/contracts';
import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { createRequirePermission } from '../../auth/authenticate.js';
import { getDemoClinicalAlertsForPatient } from '../../clinical/service.js';
import type { Database } from '../../db/client.js';
import type { AppConfig } from '../../config.js';
import { sendApiError } from '../../errors.js';

const orderSelectCardSchema = z.object({
  id: z.string(),
  variant: z.enum(['info', 'suggestion', 'warning']),
  label: z.string(),
  detail: z.string().optional(),
  hook: z.literal('order-select'),
  ruleId: z.string(),
  source: clinicalAlertSchema.shape.source.optional(),
});

const orderSelectResponseSchema = z.object({
  patientId: z.string(),
  readOnly: z.literal(true),
  evaluatedAt: z.string(),
  cards: z.array(orderSelectCardSchema),
});

function parseFieldsQuery(raw: string | undefined): Record<string, string> | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const fields: Record<string, string> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === 'string' && value.trim()) fields[key] = value.trim();
    }
    return Object.keys(fields).length > 0 ? fields : undefined;
  } catch {
    return undefined;
  }
}

/** MF-CU-03 — GET /api/cds/order-select/:patientId (prescripción demo). */
export async function registerCdsRoutes(
  app: FastifyInstance,
  _config: AppConfig,
  db: Database | null,
) {
  const requirePatientRead = createRequirePermission(_config, 'patient.read');

  app.get(
    '/api/cds/order-select/:patientId',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      if (!db) {
        return sendApiError(reply, 503, 'Base de datos no disponible');
      }

      const { patientId } = request.params as { patientId: string };
      const query = request.query as { blueprintId?: string; fields?: string };
      const blueprintId = query.blueprintId ?? 'prescription';
      const alertOpts: Parameters<typeof getDemoClinicalAlertsForPatient>[2] = {
        blueprintId,
      };
      const currentFields = parseFieldsQuery(query.fields);
      if (currentFields) alertOpts.currentFields = currentFields;

      const evaluated = await getDemoClinicalAlertsForPatient(db, patientId, alertOpts);
      if (!evaluated) {
        return sendApiError(reply, 404, 'Paciente no encontrado');
      }

      const cards = mapClinicalAlertsToOrderSelectCards(evaluated.alerts);
      return orderSelectResponseSchema.parse({
        patientId,
        readOnly: true,
        evaluatedAt: evaluated.evaluatedAt,
        cards,
      });
    },
  );
}
