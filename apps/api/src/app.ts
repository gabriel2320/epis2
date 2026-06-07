import cookie from '@fastify/cookie';
import cors from '@fastify/cors';
import { EPIS2_PHASE, healthResponseSchema } from '@epis2/contracts';
import Fastify from 'fastify';
import { registerAuthRoutes } from './auth/routes.js';
import { registerAiRoutes } from './ai/routes.js';
import { registerCommandRoutes } from './commands/routes.js';
import { registerClinicalRoutes } from './clinical/routes.js';
import { registerFhirRoutes } from './fhir/routes.js';
import { registerDashboardRoutes } from './dashboard/routes.js';
import { registerAuditRoutes } from './audit/routes.js';
import { registerInteropRoutes } from './interop/routes.js';
import { registerInpatientRoutes } from './inpatient/routes.js';
import { registerOpsRoutes } from './ops/routes.js';
import { registerAdminRoutes } from './admin/routes.js';
import type { AppConfig } from './config.js';
import { getDatabase, pingDatabase } from './db/client.js';

const VERSION = '0.1.0';

export async function buildApp(config: AppConfig) {
  const app = Fastify({ logger: config.NODE_ENV !== 'test' });
  const db = getDatabase(config.DATABASE_URL);

  await app.register(cors, {
    origin: config.WEB_ORIGIN,
    credentials: true,
  });
  await app.register(cookie);

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
    message: 'MVP v1 — piloto demo y journey dorado (EPIS2-11)',
    database: Boolean(config.DATABASE_URL && db),
  }));

  await registerAuthRoutes(app, config, db);
  await registerCommandRoutes(app, config, db);
  await registerAiRoutes(app, config, db);
  await registerClinicalRoutes(app, config, db);
  await registerFhirRoutes(app, config, db);
  await registerDashboardRoutes(app, config, db);
  await registerInpatientRoutes(app, config, db);
  await registerAuditRoutes(app, config, db);
  await registerOpsRoutes(app, config, db);
  await registerAdminRoutes(app, config, db);
  await registerInteropRoutes(app, config, db);

  return app;
}

