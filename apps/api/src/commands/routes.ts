import {
  rankCommandDefinitions,
  type CommandActiveContext,
  type CommandResolveInput,
} from '@epis2/command-registry';
import { buildCommandTelemetryEvent } from '@epis2/command-registry/telemetry';
import {
  commandResolveRequestSchema,
  commandResolveResponseSchema,
  commandSuggestRequestSchema,
  commandSuggestResponseSchema,
} from '@epis2/contracts';
import type { FastifyInstance } from 'fastify';
import { createAuthenticate, type AuthenticatedRequest } from '../auth/authenticate.js';
import type { AppConfig } from '../config.js';
import { sendApiError } from '../errors.js';
import type { Database } from '../db/client.js';
import { createRateLimitPreHandler } from '../security/rateLimit.js';
import { appendAudit } from '../audit/store.js';
import { resolveCommandWithOptionalAssist } from './resolveWithAssist.js';

function compactCommandContext(
  ctx: NonNullable<import('@epis2/contracts').CommandResolveRequest['context']>,
): CommandActiveContext {
  const out: CommandActiveContext = {};
  if (ctx.pendingDraftCount !== undefined) out.pendingDraftCount = ctx.pendingDraftCount;
  if (ctx.activeAlertCount !== undefined) out.activeAlertCount = ctx.activeAlertCount;
  if (ctx.workspace !== undefined) out.workspace = ctx.workspace;
  if (ctx.chartMode !== undefined) out.chartMode = ctx.chartMode;
  if (ctx.paperSurface !== undefined) out.paperSurface = ctx.paperSurface;
  if (ctx.plannerView !== undefined) out.plannerView = ctx.plannerView;
  if (ctx.traditionalSection !== undefined) out.traditionalSection = ctx.traditionalSection;
  if (ctx.assistBlueprintId !== undefined) out.assistBlueprintId = ctx.assistBlueprintId;
  return out;
}

export async function registerCommandRoutes(
  app: FastifyInstance,
  config: AppConfig,
  db: Database | null,
) {
  const authenticate = createAuthenticate(config);
  const limitCommands = createRateLimitPreHandler({
    keyPrefix: 'commands',
    max: 60,
    windowMs: 60_000,
    nodeEnv: config.NODE_ENV,
  });

  app.post(
    '/api/commands/resolve',
    { preHandler: [limitCommands, authenticate] },
    async (request, reply) => {
      const parsed = commandResolveRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        return sendApiError(reply, 400, 'Comando inválido');
      }

      const session = (request as AuthenticatedRequest).session;
      const started = Date.now();
      const resolveInput: CommandResolveInput = {
        text: parsed.data.text,
        role: session.role,
      };
      if (parsed.data.patientId !== undefined) {
        resolveInput.patientId = parsed.data.patientId;
      }
      if (parsed.data.context !== undefined) {
        resolveInput.context = compactCommandContext(parsed.data.context);
      }
      if (parsed.data.confirmed === true) {
        resolveInput.confirmed = true;
      }

      const { result, assistRouteUsed } = await resolveCommandWithOptionalAssist(
        config,
        resolveInput,
      );
      const telemetry = buildCommandTelemetryEvent({
        text: parsed.data.text,
        role: session.role,
        result,
        latencyMs: Date.now() - started,
        ...(parsed.data.patientId ? { patientId: parsed.data.patientId } : {}),
        ...(assistRouteUsed ? { assistRouteUsed: true } : {}),
      });

      void appendAudit(db, {
        eventType: 'command.resolve',
        actorId: session.sub,
        username: session.username,
        entityType: 'command',
        message: telemetry.outcome,
        payload: telemetry,
      });

      if (result.status === 'forbidden') {
        return sendApiError(reply, 403, result.message);
      }

      const body = commandResolveResponseSchema.parse(result);
      return reply.send(body);
    },
  );

  app.post(
    '/api/commands/suggest',
    { preHandler: [limitCommands, authenticate] },
    async (request, reply) => {
      const parsed = commandSuggestRequestSchema.safeParse(request.body);
      if (!parsed.success) {
        return sendApiError(reply, 400, 'Texto inválido para sugerencias');
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
    },
  );
}
