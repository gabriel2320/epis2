import {
  aiAssistDraftRequestSchema,
  healthResponseSchema,
} from '@epis2/contracts';
import Fastify from 'fastify';
import { runDraftAssist } from './assist.js';
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
      return reply.status(503).send(result);
    }
    if (result.status === 'rejected') {
      return reply.status(422).send(result);
    }
    return reply.send(result);
  });

  return app;
}
