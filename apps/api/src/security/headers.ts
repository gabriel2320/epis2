import type { FastifyInstance } from 'fastify';
import type { AppConfig } from '../config.js';
import { securityHeaderValues } from './httpBaseline.js';

/** Headers HTTP mínimos (auditoría Fase 5 / MF-CON-06) sin dependencia helmet. */
export function registerSecurityHeaders(app: FastifyInstance, config: AppConfig): void {
  const values = securityHeaderValues(config);
  app.addHook('onSend', async (_request, reply) => {
    for (const [name, value] of Object.entries(values)) {
      reply.header(name, value);
    }
  });
}
