import { describeIntegration } from '@epis2/test-fixtures/integration';
import { inArray } from 'drizzle-orm';
import { afterAll, expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { getDatabase } from '../db/client.js';
import { clinicalDrafts } from '../db/schema.js';
import { testApiConfig } from '../testConfig.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

const createdDraftIds: string[] = [];

describeIntegration('GET /api/drafts — paginación (MF-NORM-105)', () => {
  afterAll(async () => {
    if (createdDraftIds.length === 0) return;
    const db = getDatabase(config.DATABASE_URL);
    if (db) {
      await db.delete(clinicalDrafts).where(inArray(clinicalDrafts.id, createdDraftIds));
    }
  });

  it('aplica límite por defecto 50, respeta limit/offset y rechaza valores fuera de rango', async () => {
    const app = await buildApp(config);

    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const patients = await app.inject({
      method: 'GET',
      url: '/api/patients',
      headers: { cookie },
    });
    const patientId = (patients.json() as { patients: { id: string }[] }).patients[0]?.id;
    if (!patientId) throw new Error('Sin pacientes de demo en la base');

    for (let i = 0; i < 55; i += 1) {
      const created = await app.inject({
        method: 'POST',
        url: '/api/drafts',
        headers: { cookie },
        payload: {
          patientId,
          draftType: 'evolution_note',
          title: `Paginación demo ${i}`,
          body: { texto: `borrador sintético ${i}` },
        },
      });
      expect(created.statusCode).toBe(201);
      createdDraftIds.push((created.json() as { draft: { id: string } }).draft.id);
    }

    const byDefault = await app.inject({
      method: 'GET',
      url: `/api/drafts?patientId=${patientId}`,
      headers: { cookie },
    });
    expect(byDefault.statusCode).toBe(200);
    const defaultJson = byDefault.json() as { drafts: unknown[]; limit: number; offset: number };
    expect(defaultJson.limit).toBe(50);
    expect(defaultJson.offset).toBe(0);
    expect(defaultJson.drafts).toHaveLength(50);

    const page2 = await app.inject({
      method: 'GET',
      url: `/api/drafts?patientId=${patientId}&limit=50&offset=50`,
      headers: { cookie },
    });
    expect(page2.statusCode).toBe(200);
    const page2Json = page2.json() as { drafts: { id: string }[] };
    expect(page2Json.drafts.length).toBeGreaterThanOrEqual(5);

    const firstPageIds = new Set((defaultJson.drafts as { id: string }[]).map((d) => d.id));
    expect(page2Json.drafts.every((d) => !firstPageIds.has(d.id))).toBe(true);

    const tooBig = await app.inject({
      method: 'GET',
      url: '/api/drafts?limit=500',
      headers: { cookie },
    });
    expect(tooBig.statusCode).toBe(400);

    const zero = await app.inject({
      method: 'GET',
      url: '/api/drafts?limit=0',
      headers: { cookie },
    });
    expect(zero.statusCode).toBe(400);

    await app.close();
  });
});
