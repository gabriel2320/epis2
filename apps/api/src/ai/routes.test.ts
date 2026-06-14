import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';
import * as aiClient from './client.js';
import type { OtelHandle } from '../otel.js';

const config = testApiConfig;

let otel: OtelHandle | null = null;

describe('AI routes', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(async () => {
    await otel?.shutdown();
    otel = null;
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

  it('assist devuelve unavailable cuando local-ai no responde', async () => {
    vi.spyOn(aiClient, 'requestDraftAssist').mockResolvedValue({
      httpStatus: 503,
      body: {
        status: 'unavailable',
        message: 'IA local no disponible — el flujo manual sigue operativo.',
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
        patientId: 'a0000002-0000-4000-8000-7e3ca20d97a4',
      },
    });
    expect(res.statusCode).toBe(503);
    const body = res.json() as { status: string; requiresHumanReview: boolean };
    expect(body.status).toBe('unavailable');
    expect(body.requiresHumanReview).toBe(true);
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

  it('MF-IM-04 — assist persiste documentCitations en output_payload', async () => {
    vi.spyOn(aiClient, 'requestDraftAssist').mockResolvedValue({
      httpStatus: 200,
      body: {
        status: 'success',
        suggestedFields: { objective: 'Control alergias documentadas' },
        safetyNotes: ['Revisar alergia demo'],
        requiresHumanReview: true,
        model: 'test-model',
        latencyMs: 12,
        promptHash: 'hash-demo',
        documentCitations: [
          {
            documentId: 'e0000001-0000-4000-8000-000000000005',
            chunkIndex: 0,
          },
        ],
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
        patientId: 'a0000001-0000-4000-8000-000000000005',
      },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json() as {
      status: string;
      documentCitations?: { documentId: string; chunkIndex: number }[];
    };
    expect(body.status).toBe('success');
    expect(body.documentCitations?.[0]?.documentId).toBe('e0000001-0000-4000-8000-000000000005');
    await app.close();
  });

  it('MF-IM-09 — assist/draft emite span ai.run con OTEL activo', async () => {
    vi.spyOn(aiClient, 'requestDraftAssist').mockResolvedValue({
      httpStatus: 200,
      body: {
        status: 'success',
        suggestedFields: { objective: 'Control demo' },
        safetyNotes: [],
        requiresHumanReview: true,
        model: 'ollama-demo',
        latencyMs: 88,
        promptHash: 'abc',
        provider: 'ollama',
      },
    });

    const { InMemorySpanExporter, SimpleSpanProcessor } =
      await import('@opentelemetry/sdk-trace-base');
    const exporter = new InMemorySpanExporter();
    const processor = new SimpleSpanProcessor(exporter);
    const { startOtel } = await import('../otel.js');
    otel = startOtel({ ...testApiConfig, OTEL_ENABLED: true }, { spanProcessors: [processor] });

    const app = await buildApp(config);
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    await app.inject({
      method: 'POST',
      url: '/api/ai/assist/draft',
      headers: { cookie },
      payload: {
        blueprintId: 'evolution_note',
        patientId: 'a0000001-0000-4000-8000-000000000001',
      },
    });

    await processor.forceFlush();
    const aiRun = exporter.getFinishedSpans().find((s) => s.name === 'ai.run');
    expect(aiRun).toBeDefined();
    expect(aiRun?.attributes.blueprintId).toBe('evolution_note');
    expect(aiRun?.attributes.model).toBe('ollama-demo');
    expect(aiRun?.attributes.latencyMs).toBe(88);
    expect(aiRun?.attributes.provider).toBe('ollama');
    await app.close();
  });

  it('MF-SH-03 — flujo manual: resolver comando sin depender de IA', async () => {
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
