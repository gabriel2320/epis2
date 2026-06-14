import {
  mapClinicalAlertsToOrderSelectCards,
  mapClinicalAlertsToPatientViewCards,
} from '@epis2/clinical-domain';
import {
  cdsCardsRequestSchema,
  cdsCardsResponseSchema,
  cdsHookIdSchema,
  clinicalAlertSchema,
} from '@epis2/contracts';
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

function normalizeFieldsRecord(
  fields: Record<string, string> | undefined,
): Record<string, string> | undefined {
  if (!fields) return undefined;
  const normalized: Record<string, string> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (typeof value === 'string' && value.trim()) normalized[key] = value.trim();
  }
  return Object.keys(normalized).length > 0 ? normalized : undefined;
}

async function evaluateCdsCards(
  db: Database,
  patientId: string,
  hook: z.infer<typeof cdsHookIdSchema>,
  options?: { blueprintId?: string; fields?: Record<string, string> },
) {
  const alertOpts: Parameters<typeof getDemoClinicalAlertsForPatient>[2] = {};
  if (options?.blueprintId !== undefined) alertOpts.blueprintId = options.blueprintId;
  const currentFields = normalizeFieldsRecord(options?.fields);
  if (currentFields) alertOpts.currentFields = currentFields;

  const evaluated = await getDemoClinicalAlertsForPatient(db, patientId, alertOpts);
  if (!evaluated) return null;

  const cards =
    hook === 'patient-view'
      ? mapClinicalAlertsToPatientViewCards(evaluated.alerts)
      : mapClinicalAlertsToOrderSelectCards(evaluated.alerts);

  return cdsCardsResponseSchema.parse({
    patientId,
    readOnly: true,
    evaluatedAt: evaluated.evaluatedAt,
    hook,
    cards,
  });
}

/** MF-CU-03 / MF-CU-04 — CDS Hooks demo (prefetch paciente interno, sin FHIR externo). */
export async function registerCdsRoutes(
  app: FastifyInstance,
  _config: AppConfig,
  db: Database | null,
) {
  const requirePatientRead = createRequirePermission(_config, 'patient.read');

  app.get(
    '/api/cds/cards/:patientId',
    { preHandler: requirePatientRead },
    async (request, reply) => {
      if (!db) {
        return sendApiError(reply, 503, 'Base de datos no disponible');
      }

      const { patientId } = request.params as { patientId: string };
      const query = request.query as { hook?: string; blueprintId?: string; fields?: string };
      const hookParsed = cdsHookIdSchema.safeParse(query.hook);
      if (!hookParsed.success) {
        return sendApiError(reply, 400, 'Parámetro hook inválido (patient-view | order-select)');
      }

      const parsedFields = parseFieldsQuery(query.fields);
      const result = await evaluateCdsCards(db, patientId, hookParsed.data, {
        ...(query.blueprintId !== undefined ? { blueprintId: query.blueprintId } : {}),
        ...(parsedFields ? { fields: parsedFields } : {}),
      });
      if (!result) {
        return sendApiError(reply, 404, 'Paciente no encontrado');
      }
      return result;
    },
  );

  app.post('/api/cds/cards', { preHandler: requirePatientRead }, async (request, reply) => {
    if (!db) {
      return sendApiError(reply, 503, 'Base de datos no disponible');
    }

    const parsed = cdsCardsRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return sendApiError(reply, 400, 'Cuerpo inválido');
    }

    const { patientId, hook, blueprintId, fields } = parsed.data;
    const evalOpts: { blueprintId?: string; fields?: Record<string, string> } = {};
    if (blueprintId !== undefined) evalOpts.blueprintId = blueprintId;
    const normalizedFields = normalizeFieldsRecord(fields);
    if (normalizedFields) evalOpts.fields = normalizedFields;

    const result = await evaluateCdsCards(db, patientId, hook, evalOpts);
    if (!result) {
      return sendApiError(reply, 404, 'Paciente no encontrado');
    }
    return result;
  });

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
