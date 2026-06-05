import { rankCommandDefinitions, resolveCommand } from '@epis2/command-registry';
import {
  commandResolveRequestSchema,
  commandResolveResponseSchema,
  commandSuggestRequestSchema,
  commandSuggestResponseSchema,
} from '@epis2/contracts';
import type { FastifyInstance } from 'fastify';
import {
  createAuthenticate,
  type AuthenticatedRequest,
} from '../auth/authenticate.js';
import type { AppConfig } from '../config.js';

export async function registerCommandRoutes(app: FastifyInstance, config: AppConfig) {
  const authenticate = createAuthenticate(config);

  app.post('/api/commands/resolve', { preHandler: authenticate }, async (request, reply) => {
    const parsed = commandResolveRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Comando inválido' });
    }

    const session = (request as AuthenticatedRequest).session;
    const resolveInput: Parameters<typeof resolveCommand>[0] = {
      text: parsed.data.text,
      role: session.role,
    };
    if (parsed.data.patientId !== undefined) {
      resolveInput.patientId = parsed.data.patientId;
    }

    const result = resolveCommand(resolveInput);

    if (result.status === 'forbidden') {
      return reply.status(403).send({
        error: result.message,
        permission: result.permission,
      });
    }

    const body = commandResolveResponseSchema.parse(result);
    return reply.send(body);
  });

  app.post('/api/commands/suggest', { preHandler: authenticate }, async (request, reply) => {
    const parsed = commandSuggestRequestSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Texto inválido para sugerencias' });
    }

    const ranked = rankCommandDefinitions(parsed.data.text).slice(0, 5);
    const body = commandSuggestResponseSchema.parse({
      readOnly: true,
      suggestions: ranked.map((r) => ({
        intent: r.def.intent,
        labelEs: r.def.labelEs,
        score: r.score,
        sampleEs: r.def.aliasesEs[0],
      })),
    });
    return reply.send(body);
  });
}
