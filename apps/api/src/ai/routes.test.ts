import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';
import * as aiClient from './client.js';

const config = testApiConfig;

describe('AI routes', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('GET /api/ai/runs requiere sesión', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({ method: 'GET', url: '/api/ai/runs' });
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/ai/rag/query requiere sesión', async () => {
    const app = await buildApp(testApiConfig);
    const res = await app.inject({
      method: 'POST',
      url: '/api/ai/rag/query',
      payload: { patientId: '00000000-0000-4000-8000-000000000001', question: 'lab' },
    });
    expect(res.statusCode).toBe(401);
  });

  it('status indica IA no disponible sin Ollama', async () => {
    vi.spyOn(aiClient, 'fetchLocalAiStatus').mockResolvedValue(false);
    vi.spyOn(aiClient, 'pingOllama').mockResolvedValue(false);

    const app = await buildApp(config);
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const res = await app.inject({
      method: 'GET',
      url: '/api/ai/status',
      headers: { cookie },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as { available: boolean };
    expect(body.available).toBe(false);
    await app.close();
  });

  it('assist rechaza respuesta inválida y no devuelve success', async () => {
    vi.spyOn(aiClient, 'requestDraftAssist').mockResolvedValue({
      httpStatus: 422,
      body: {
        status: 'rejected',
        message: 'Respuesta IA no cumple el schema de asistencia',
        promptHash: 'abc',
        model: 'test',
        latencyMs: 10,
      },
    });

    const app = await buildApp(config);
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const res = await app.inject({
      method: 'POST',
      url: '/api/ai/assist/draft',
      headers: { cookie },
      payload: {
        blueprintId: 'evolution_note',
        patientId: 'a0000001-0000-4000-8000-000000000001',
      },
    });
    expect(res.statusCode).toBe(422);
    expect((res.json() as { status: string }).status).toBe('rejected');
    await app.close();
  });

  it('flujo manual: resolver comando sin depender de IA', async () => {
    const app = await buildApp(config);
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const res = await app.inject({
      method: 'POST',
      url: '/api/commands/resolve',
      headers: { cookie },
      payload: { text: 'buscar paciente' },
    });
    expect(res.statusCode).toBe(200);
    expect((res.json() as { status: string }).status).toBe('resolved');
    await app.close();
  });
});
