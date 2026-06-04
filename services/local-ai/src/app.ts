import { healthResponseSchema } from '@epis2/contracts';
import Fastify from 'fastify';
import type { AiConfig } from './config.js';
import { pingOllama } from './ollama.js';

const VERSION = '0.1.0';

export async function buildAiApp(config: AiConfig) {
  const app = Fastify({ logger: false });

  app.get('/health', async () =>
    healthResponseSchema.parse({
      status: 'ok',
      service: 'epis2-local-ai',
      version: VERSION,
      timestamp: new Date().toISOString(),
    }),
  );

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

  return app;
}
