import type { FastifyReply, FastifyRequest } from 'fastify';
import { describe, expect, it, vi } from 'vitest';
import { createLocalAiAuthHook, LOCAL_AI_API_KEY_HEADER } from './localAiAuth.js';

function mockRequest(url: string, apiKey?: string): FastifyRequest {
  return {
    url,
    headers: apiKey ? { [LOCAL_AI_API_KEY_HEADER]: apiKey } : {},
  } as unknown as FastifyRequest;
}

type MockReply = FastifyReply & {
  statusCode?: number;
  payload?: unknown;
  status: ReturnType<typeof vi.fn>;
  send: ReturnType<typeof vi.fn>;
};

function mockReply(): MockReply {
  return {
    statusCode: undefined as number | undefined,
    payload: undefined as unknown,
    status: vi.fn(function status(this: { statusCode?: number }, code: number) {
      this.statusCode = code;
      return this;
    }),
    send: vi.fn(async function send(this: { payload?: unknown }, payload: unknown) {
      this.payload = payload;
      return this;
    }),
  } as unknown as MockReply;
}

describe('local-ai auth (A1)', () => {
  it('sin LOCAL_AI_API_KEY deja endpoints abiertos en dev', async () => {
    const hook = createLocalAiAuthHook(undefined);
    const reply = mockReply();
    await hook(mockRequest('/assist/draft-suggestion'), reply);
    expect(reply.status).not.toHaveBeenCalled();
  });

  it('con LOCAL_AI_API_KEY exige header en /assist/*', async () => {
    const hook = createLocalAiAuthHook('epis2-local-ai-test-key-32');
    const blocked = mockReply();
    await hook(mockRequest('/assist/draft-suggestion'), blocked);
    expect(blocked.status).toHaveBeenCalledWith(401);

    const allowed = mockReply();
    await hook(mockRequest('/assist/draft-suggestion', 'epis2-local-ai-test-key-32'), allowed);
    expect(allowed.status).not.toHaveBeenCalled();
  });

  it('/health sigue publico con clave configurada', async () => {
    const hook = createLocalAiAuthHook('epis2-local-ai-test-key-32');
    const reply = mockReply();
    await hook(mockRequest('/health'), reply);
    expect(reply.status).not.toHaveBeenCalled();
  });

  it('con LOCAL_AI_API_KEY exige header en /embed/document', async () => {
    const hook = createLocalAiAuthHook('epis2-local-ai-test-key-32');
    const blocked = mockReply();
    await hook(mockRequest('/embed/document'), blocked);
    expect(blocked.status).toHaveBeenCalledWith(401);
  });
});
