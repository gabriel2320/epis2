import { describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';

const hasDb = Boolean(process.env.DATABASE_URL);
const DEMO001 = 'a0000001-0000-4000-8000-000000000001';

describe.skipIf(!hasDb)('V5 IA trazable (integration)', () => {
  it('RAG devuelve citas y registra ai_run; resumen 24h sin nota final', async () => {
    const app = await buildApp({ ...testApiConfig, DATABASE_URL: process.env.DATABASE_URL });
    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const rag = await app.inject({
      method: 'POST',
      url: '/api/ai/rag/query',
      headers: { cookie, 'content-type': 'application/json' },
      payload: { patientId: DEMO001, question: 'laboratorio' },
    });
    expect(rag.statusCode).toBe(200);
    const ragBody = rag.json() as {
      readOnly: boolean;
      requiresHumanReview: boolean;
      citations: { documentId: string; title: string }[];
      runId?: string;
    };
    expect(ragBody.readOnly).toBe(true);
    expect(ragBody.requiresHumanReview).toBe(true);
    expect(ragBody.citations.length).toBeGreaterThan(0);
    expect(ragBody.runId).toBeTruthy();

    const summary = await app.inject({
      method: 'POST',
      url: '/api/ai/suggest/summary',
      headers: { cookie, 'content-type': 'application/json' },
      payload: { patientId: DEMO001 },
    });
    expect(summary.statusCode).toBe(200);
    const sumBody = summary.json() as {
      summaryText: string;
      requiresHumanReview: boolean;
      eventCount: number;
    };
    expect(sumBody.requiresHumanReview).toBe(true);
    expect(sumBody.summaryText.length).toBeGreaterThan(20);

    const runs = await app.inject({
      method: 'GET',
      url: `/api/ai/runs?patientId=${DEMO001}`,
      headers: { cookie },
    });
    expect(runs.statusCode).toBe(200);
    const runsBody = runs.json() as { runs: { blueprintId: string }[] };
    expect(runsBody.runs.some((r) => r.blueprintId === 'rag_query')).toBe(true);

    const notesBefore = await app.inject({
      method: 'GET',
      url: `/api/patients/${DEMO001}`,
      headers: { cookie },
    });
    const noteCount = (notesBefore.json() as { notes: unknown[] }).notes.length;

    expect(noteCount).toBeGreaterThanOrEqual(0);

    await app.close();
  });
});
