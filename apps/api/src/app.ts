import { EPIS2_PHASE, healthResponseSchema } from '@epis2/contracts';
import Fastify from 'fastify';
import type { AppConfig } from './config.js';
import { pingDatabase } from './db.js';

const VERSION = '0.1.0';

export async function buildApp(config: AppConfig) {
  const app = Fastify({ logger: config.NODE_ENV !== 'test' });

  app.get('/health', async () => {
    const body = healthResponseSchema.parse({
      status: 'ok',
      service: 'epis2-api',
      version: VERSION,
      timestamp: new Date().toISOString(),
      checks: { database: config.DATABASE_URL ? 'skipped' : 'skipped' },
    });
    return body;
  });

  app.get('/ready', async (_req, reply) => {
    const checks: Record<string, 'up' | 'down' | 'skipped'> = {
      database: 'skipped',
    };

    if (config.DATABASE_URL) {
      const up = await pingDatabase(config.DATABASE_URL);
      checks.database = up ? 'up' : 'down';
    }

    const allUp = Object.values(checks).every((v) => v === 'up' || v === 'skipped');
    const status = allUp ? 'ok' : 'degraded';

    const body = healthResponseSchema.parse({
      status,
      service: 'epis2-api',
      version: VERSION,
      timestamp: new Date().toISOString(),
      checks,
    });

    if (!allUp) {
      return reply.status(503).send(body);
    }
    return body;
  });

  app.get('/api/meta', async () => ({
    product: 'EPIS2',
    phase: EPIS2_PHASE,
    message: 'Bootstrap API — sin lógica clínica aún',
  }));

  return app;
}
