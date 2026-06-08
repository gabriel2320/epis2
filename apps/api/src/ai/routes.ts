import {
  aiAssistDraftRequestSchema,
  aiAssistDraftResponseSchema,
  aiTextboxAssistRequestSchema,
  aiTextboxAssistResponseSchema,
  aiRunsListResponseSchema,
  aiStatusResponseSchema,
  aiSummarySuggestRequestSchema,
  aiSummarySuggestResponseSchema,
  ragQueryRequestSchema,
  ragQueryResponseSchema,
} from '@epis2/contracts';
import type { FastifyInstance } from 'fastify';
import {
  createAuthenticate,
  createRequirePermission,
  type AuthenticatedRequest,
} from '../auth/authenticate.js';
import type { AppConfig } from '../config.js';
import type { Database } from '../db/client.js';
import { fetchLocalAiStatus, pingOllama, requestDraftAssist, requestTextboxAssist } from './client.js';
import { getDemoSafetyNotesForPatient } from '../clinical/service.js';
import { queryPatientRag } from './rag.js';
import { suggestPatientSummary24h } from './summary.js';
import { listRecentAiRuns, recordAiRun, type AiRunRecord } from './store.js';
import { createRateLimitPreHandler } from '../security/rateLimit.js';

export async function registerAiRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  const authenticate = createAuthenticate(config);
  const requireDraftWrite = createRequirePermission(config, 'draft.write');
  const requireAiRead = createRequirePermission(config, 'ai.read');
  const limitAi = createRateLimitPreHandler({
    keyPrefix: 'ai',
    max: 30,
    windowMs: 60_000,
    nodeEnv: config.NODE_ENV,
  });

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
    { preHandler: [limitAi, requireDraftWrite] },
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
          const safetyOpts: Parameters<typeof getDemoSafetyNotesForPatient>[2] = {
            blueprintId: parsed.data.blueprintId,
          };
          if (parsed.data.currentFields !== undefined) {
            safetyOpts.currentFields = parsed.data.currentFields;
          }
          const cdsNotes = await getDemoSafetyNotesForPatient(
            db,
            parsed.data.patientId,
            safetyOpts,
          );
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

  app.post(
    '/api/ai/assist/textbox',
    { preHandler: [limitAi, requireDraftWrite] },
    async (request, reply) => {
      const parsed = aiTextboxAssistRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Solicitud textbox IA inválida' });
      }
      const session = (request as AuthenticatedRequest).session;
      const { httpStatus, body } = await requestTextboxAssist(
        config.LOCAL_AI_BASE_URL,
        parsed.data,
      );

      const baseRun: Pick<AiRunRecord, 'actorId' | 'blueprintId' | 'inputPayload'> & {
        patientId?: string;
      } = {
        actorId: session.sub,
        blueprintId: 'clinical_textbox',
        inputPayload: parsed.data as Record<string, unknown>,
      };
      if (parsed.data.patientId !== undefined) {
        baseRun.patientId = parsed.data.patientId;
      }

      if (body.status === 'success') {
        await recordAiRun(db, {
          ...baseRun,
          promptHash: 'textbox-assist',
          model: body.model ?? 'unknown',
          latencyMs: body.latencyMs ?? 0,
          status: 'success',
          outputPayload: { resultText: body.resultText },
        });
        return reply.send(
          aiTextboxAssistResponseSchema.parse({
            status: 'success',
            resultText: body.resultText,
            requiresHumanReview: true,
            model: body.model,
            latencyMs: body.latencyMs,
          }),
        );
      }

      await recordAiRun(db, {
        ...baseRun,
        promptHash: 'textbox-assist',
        model: 'unknown',
        latencyMs: 0,
        status: body.status,
        errorMessage: body.message,
      });

      return reply.status(httpStatus === 422 ? 422 : 503).send(
        aiTextboxAssistResponseSchema.parse({
          status: body.status,
          message: body.message,
          requiresHumanReview: true,
        }),
      );
    },
  );

  app.get(
    '/api/ai/runs',
    { preHandler: requireAiRead },
    async (request, reply) => {
      const q = request.query as { patientId?: string; limit?: string };
      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
      }
      const limit = q.limit ? Math.min(Number(q.limit), 100) : 30;
      const runs = await listRecentAiRuns(db, {
        ...(q.patientId !== undefined ? { patientId: q.patientId } : {}),
        limit: Number.isFinite(limit) ? limit : 30,
      });
      return aiRunsListResponseSchema.parse({ readOnly: true, runs });
    },
  );

  app.post(
    '/api/ai/rag/query',
    { preHandler: [limitAi, requireAiRead] },
    async (request, reply) => {
      const parsed = ragQueryRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Consulta RAG inválida' });
      }
      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
      }
      const session = (request as AuthenticatedRequest).session;
      const result = await queryPatientRag(
        db,
        config,
        session.sub,
        parsed.data.patientId,
        parsed.data.question,
      );
      return ragQueryResponseSchema.parse(result);
    },
  );

  app.post(
    '/api/ai/suggest/summary',
    { preHandler: [limitAi, requireAiRead] },
    async (request, reply) => {
      const parsed = aiSummarySuggestRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send({ error: 'Solicitud de resumen inválida' });
      }
      if (!db) {
        return reply.status(503).send({ error: 'Base de datos no disponible' });
      }
      const session = (request as AuthenticatedRequest).session;
      const result = await suggestPatientSummary24h(
        db,
        config,
        session.sub,
        parsed.data.patientId,
      );
      return aiSummarySuggestResponseSchema.parse(result);
    },
  );
}
