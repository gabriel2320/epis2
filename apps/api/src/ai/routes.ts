import {
  aiAssistDraftRequestSchema,
  aiAssistDraftResponseSchema,
  aiStatusResponseSchema,
} from '@epis2/contracts';
import type { FastifyInstance } from 'fastify';
import {
  createAuthenticate,
  createRequirePermission,
  type AuthenticatedRequest,
} from '../auth/authenticate.js';
import type { AppConfig } from '../config.js';
import type { Database } from '../db/client.js';
import { fetchLocalAiStatus, pingOllama, requestDraftAssist } from './client.js';
import { getDemoSafetyNotesForPatient } from '../clinical/service.js';
import { recordAiRun, type AiRunRecord } from './store.js';

export async function registerAiRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  const authenticate = createAuthenticate(config);
  const requireDraftWrite = createRequirePermission(config, 'draft.write');

  app.get('/api/ai/status', { preHandler: authenticate }, async () => {
    const localAiUp = await fetchLocalAiStatus(config.LOCAL_AI_BASE_URL);
    let ollama: 'up' | 'down' | 'unknown' = 'unknown';
    if (localAiUp) {
      const up = await pingOllama(config.OLLAMA_BASE_URL);
      ollama = up ? 'up' : 'down';
    } else {
      ollama = 'down';
    }

    const available = localAiUp && ollama === 'up';
    return aiStatusResponseSchema.parse({
      available,
      ollama,
      localAi: localAiUp ? 'up' : 'down',
      message: available
        ? 'Asistencia IA local disponible (demo).'
        : 'IA no disponible — el flujo manual sigue operativo.',
    });
  });

  app.post(
    '/api/ai/assist/draft',
    { preHandler: requireDraftWrite },
    async (request, reply) => {
      const parsed = aiAssistDraftRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Solicitud IA inválida' });
      }

      const session = (request as AuthenticatedRequest).session;
      const { httpStatus, body } = await requestDraftAssist(
        config.LOCAL_AI_BASE_URL,
        parsed.data,
      );

      const baseRun: Pick<AiRunRecord, 'actorId' | 'blueprintId' | 'inputPayload'> & {
        patientId?: string;
      } = {
        actorId: session.sub,
        blueprintId: parsed.data.blueprintId,
        inputPayload: parsed.data as Record<string, unknown>,
      };
      if (parsed.data.patientId !== undefined) {
        baseRun.patientId = parsed.data.patientId;
      }

      if (body.status === 'success') {
        let safetyNotes = [...body.safetyNotes];
        if (db && parsed.data.patientId) {
          const cdsNotes = await getDemoSafetyNotesForPatient(db, parsed.data.patientId);
          safetyNotes = [...new Set([...cdsNotes, ...safetyNotes])];
        }

        const row = await recordAiRun(db, {
          ...baseRun,
          promptHash: body.promptHash,
          model: body.model,
          latencyMs: body.latencyMs,
          status: 'success',
          outputPayload: {
            suggestedFields: body.suggestedFields,
            safetyNotes,
          },
        });

        const response = aiAssistDraftResponseSchema.parse({
          status: 'success',
          suggestedFields: body.suggestedFields,
          safetyNotes,
          requiresHumanReview: true,
          runId: row?.id,
          model: body.model,
          latencyMs: body.latencyMs,
        });
        return reply.send(response);
      }

      if (body.status === 'rejected') {
        const row = await recordAiRun(db, {
          ...baseRun,
          promptHash: body.promptHash ?? 'rejected',
          model: body.model ?? 'unknown',
          latencyMs: body.latencyMs ?? 0,
          status: 'rejected',
          errorMessage: body.message,
        });
        const response = aiAssistDraftResponseSchema.parse({
          status: 'rejected',
          message: body.message,
          requiresHumanReview: true,
          runId: row?.id,
        });
        return reply.status(422).send(response);
      }

      await recordAiRun(db, {
        ...baseRun,
        promptHash: body.promptHash ?? 'unavailable',
        model: body.model ?? 'unknown',
        latencyMs: body.latencyMs ?? 0,
        status: 'unavailable',
        errorMessage: body.message,
      });

      const response = aiAssistDraftResponseSchema.parse({
        status: 'unavailable',
        message: body.message,
        requiresHumanReview: true,
      });
      return reply.status(httpStatus === 503 ? 503 : 503).send(response);
    },
  );
}
