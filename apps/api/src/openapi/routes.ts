import type { FastifyInstance } from 'fastify';
import { buildOpenApiDocument } from './document.js';

/** Sirve la spec OpenAPI generada desde Zod (MF-NORM-301). */
export function registerOpenApiRoutes(app: FastifyInstance) {
  app.get('/api/docs/openapi.json', async () => buildOpenApiDocument());
}
