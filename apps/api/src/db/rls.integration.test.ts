import { describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { testApiConfig } from '../testConfig.js';
import { DEMO_CLINICAL_CASES } from '@epis2/test-fixtures';

const hasDb = Boolean(process.env.DATABASE_URL);
const demo001 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-001')!;

describe.skipIf(!hasDb)('RLS enforce — transacciones API', () => {
  it('enfermería no lista borradores creados por el médico', async () => {
    const config = {
      ...testApiConfig,
      DATABASE_URL: process.env.DATABASE_URL,
      RLS_MODE: 'enforce' as const,
    };
    const app = await buildApp(config);

    const medLogin = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const medCookie = String(medLogin.headers['set-cookie']).split(';')[0];

    const created = await app.inject({
      method: 'POST',
      url: '/api/drafts',
      headers: { cookie: medCookie },
      payload: {
        patientId: demo001.patientId,
        draftType: 'evolution_note',
        title: 'RLS enforce test draft',
        body: { subjective: 'demo' },
      },
    });
    expect(created.statusCode).toBe(201);
    const draftId = (created.json() as { draft: { id: string } }).draft.id;

    const nurseLogin = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'enfermeria.demo', demoAuthKey: 'DEMO-CLAVE-ENFERMERIA' },
    });
    const nurseCookie = String(nurseLogin.headers['set-cookie']).split(';')[0];

    const nurseList = await app.inject({
      method: 'GET',
      url: '/api/drafts',
      headers: { cookie: nurseCookie },
    });
    expect(nurseList.statusCode).toBe(200);
    const nurseIds = (nurseList.json() as { drafts: { id: string }[] }).drafts.map((d) => d.id);
    expect(nurseIds).not.toContain(draftId);

    const medList = await app.inject({
      method: 'GET',
      url: '/api/drafts',
      headers: { cookie: medCookie },
    });
    expect(medList.statusCode).toBe(200);
    const medIds = (medList.json() as { drafts: { id: string }[] }).drafts.map((d) => d.id);
    expect(medIds).toContain(draftId);

    await app.close();
  });
});
