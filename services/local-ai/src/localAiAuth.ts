import type { FastifyReply, FastifyRequest } from 'fastify';

export const LOCAL_AI_API_KEY_HEADER = 'x-local-ai-key';
const PUBLIC_PATHS = new Set(['/health', '/ready', '/capabilities']);

/** Cuando LOCAL_AI_API_KEY esta definida, todo endpoint no-health exige el header. */
export function createLocalAiAuthHook(apiKey: string | undefined) {
  return async function localAiAuth(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!apiKey) return;
    const path = request.url.split('?')[0] ?? request.url;
    if (PUBLIC_PATHS.has(path)) return;
    const provided = request.headers[LOCAL_AI_API_KEY_HEADER];
    if (typeof provided !== 'string' || provided !== apiKey) {
      await reply.status(401).send({ error: 'No autorizado' });
    }
  };
}
