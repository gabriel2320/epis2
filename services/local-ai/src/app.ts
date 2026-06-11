import {
  aiAssistDraftRequestSchema,
  aiAssistCommandRouteRequestSchema,
  aiAssistCommandRouteResponseSchema,
  aiTextboxAssistRequestSchema,
  healthResponseSchema,
} from '@epis2/contracts';
import Fastify from 'fastify';
import { runDraftAssist } from './assist.js';
import { runCommandRouteAssist } from './commandRoute.js';
import type { AiConfig } from './config.js';
import { buildInferencePolicyConfig, createInferenceProviders } from './inference/router.js';
import { pingOpenAi } from './inference/openaiProvider.js';
import { runTextboxAssist } from './textboxAssist.js';
import { buildLocalAiCapabilities } from './gatewayCapabilities.js';
import { pingOllama } from './ollama.js';

const VERSION = '0.1.0';

export async function buildAiApp(config: AiConfig) {
  const app = Fastify({ logger: false });
  const model = config.OLLAMA_MODEL;

  app.get('/health', async () =>
    healthResponseSchema.parse({
      status: 'ok',
      service: 'epis2-local-ai',
      version: VERSION,
      timestamp: new Date().toISOString(),
    }),
  );

  app.get('/capabilities', async () => {
    const ollamaUp = await pingOllama(config.OLLAMA_BASE_URL);
    const openaiUp =
      config.AI_CLOUD_ENABLED && config.OPENAI_API_KEY
        ? await pingOpenAi(config.OPENAI_API_KEY, config.OPENAI_BASE_URL)
        : false;
    return buildLocalAiCapabilities(config, ollamaUp, openaiUp);
  });

  app.get('/ready', async (_req, reply) => {
    const ollamaUp = await pingOllama(config.OLLAMA_BASE_URL);
    const openaiUp =
      config.AI_CLOUD_ENABLED && config.OPENAI_API_KEY
        ? await pingOpenAi(config.OPENAI_API_KEY, config.OPENAI_BASE_URL)
        : false;
    const policy = buildInferencePolicyConfig(config);
    const operational = ollamaUp || (policy.cloudEnabled && openaiUp);
    const status = operational ? 'ok' : 'degraded';
    const body = healthResponseSchema.parse({
      status,
      service: 'epis2-local-ai',
      version: VERSION,
      timestamp: new Date().toISOString(),
      checks: {
        ollama: ollamaUp ? 'up' : 'down',
        openai: openaiUp ? 'up' : (policy.cloudEnabled ? 'down' : 'skipped'),
      },
    });
    if (!operational) {
      return reply.status(503).send(body);
    }
    return body;
  });

  app.post('/assist/draft-suggestion', async (request, reply) => {
    const parsed = aiAssistDraftRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Solicitud de asistencia inválida' });
    }

    const result = await runDraftAssist(config, parsed.data);

    if (result.status === 'unavailable') {
      return reply.status(503).send({ ...result, requiresHumanReview: true as const });
    }
    if (result.status === 'rejected') {
      return reply.status(422).send({ ...result, requiresHumanReview: true as const });
    }
    return reply.send(result);
  });

  app.post('/assist/command-route', async (request, reply) => {
    const parsed = aiAssistCommandRouteRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Solicitud de ruta de comando inválida' });
    }

    const result = await runCommandRouteAssist(config.OLLAMA_BASE_URL, model, parsed.data);

    if (result.status === 'unavailable') {
      return reply.status(503).send({ message: result.message, status: result.status });
    }
    if (result.status === 'rejected') {
      return reply.status(422).send({ message: result.message, status: result.status });
    }

    const body = aiAssistCommandRouteResponseSchema.parse(result);
    return reply.send(body);
  });

  app.post('/assist/textbox', async (request, reply) => {
    const parsed = aiTextboxAssistRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Solicitud textbox IA inválida' });
    }
    const result = await runTextboxAssist(config.OLLAMA_BASE_URL, model, parsed.data);
    if (result.status === 'unavailable') {
      return reply.status(503).send({ ...result, requiresHumanReview: true as const });
    }
    if (result.status === 'rejected') {
      return reply.status(422).send({ ...result, requiresHumanReview: true as const });
    }
    return reply.send(result);
  });

  return app;
}

/** @internal — expuesto para tests de readiness multi-proveedor. */
export { createInferenceProviders };
