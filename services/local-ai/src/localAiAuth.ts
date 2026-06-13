import type { FastifyReply, FastifyRequest } from 'fastify';

export const LOCAL_AI_API_KEY_HEADER = 'x-local-ai-key';

/** Cuando LOCAL_AI_API_KEY está definida, /assist/* exige el header (auditoría Fase 5 / A1). */
export function createLocalAiAuthHook(apiKey: string | undefined) {
  return async function localAiAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!apiKey) return;
    const path = request.url.split('?')[0] ?? request.url;
    if (!path.startsWith('/assist/')) return;
    const provided = request.headers[LOCAL_AI_API_KEY_HEADER];
    if (typeof provided !== 'string' || provided !== apiKey) {
      await reply.status(401).send({ error: 'No autorizado' });
    }
  };
}
