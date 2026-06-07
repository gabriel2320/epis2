import {
  aiAssistDraftRequestSchema,
  aiAssistCommandRouteRequestSchema,
  aiAssistCommandRouteResponseSchema,
  healthResponseSchema,
} from '@epis2/contracts';
import Fastify from 'fastify';
import { runDraftAssist } from './assist.js';
import { runCommandRouteAssist } from './commandRoute.js';
import type { AiConfig } from './config.js';
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
    return buildLocalAiCapabilities(ollamaUp);
  });

  app.get('/ready', async (_req, reply) => {
    const ollamaUp = await pingOllama(config.OLLAMA_BASE_URL);
    const status = ollamaUp ? 'ok' : 'degraded';
    const body = healthResponseSchema.parse({
      status,
      service: 'epis2-local-ai',
      version: VERSION,
      timestamp: new Date().toISOString(),
      checks: { ollama: ollamaUp ? 'up' : 'down' },
    });
    if (!ollamaUp) {
      return reply.status(503).send(body);
    }
    return body;
  });

  app.post('/assist/draft-suggestion', async (request, reply) => {
    const parsed = aiAssistDraftRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Solicitud de asistencia inválida' });
    }

    const result = await runDraftAssist(
      config.OLLAMA_BASE_URL,
      model,
      parsed.data,
    );

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

    const result = await runCommandRouteAssist(
      config.OLLAMA_BASE_URL,
      model,
      parsed.data,
    );

    if (result.status === 'unavailable') {
      return reply.status(503).send({ message: result.message, status: result.status });
    }
    if (result.status === 'rejected') {
      return reply.status(422).send({ message: result.message, status: result.status });
    }

    const body = aiAssistCommandRouteResponseSchema.parse(result);
    return reply.send(body);
  });

  return app;
}
