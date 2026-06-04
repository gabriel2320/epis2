import { describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { getDatabase } from '../db/client.js';
import { testApiConfig } from '../testConfig.js';
import { listApprovedNotes } from './service.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

const hasDb = Boolean(process.env.DATABASE_URL);

describe.skipIf(!hasDb)('clinical API (integration)', () => {
  it('borrador aprobado aparece en notas; borrador pendiente no', async () => {
    const app = await buildApp(config);
    const db = getDatabase(config.DATABASE_URL)!;

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
    const list = (patients.json() as {
      patients: { id: string; isSynthetic?: boolean; demoLabel?: string; demoCaseCode?: string }[];
    }).patients;
    expect(list.length).toBeGreaterThanOrEqual(5);
    expect(list.every((p) => p.isSynthetic && p.demoLabel === 'DEMO/SINTÉTICO')).toBe(true);
    expect(list.some((p) => p.demoCaseCode === 'DEMO-005')).toBe(true);

    const patientId = list[0]?.id;
    if (!patientId) throw new Error('Sin pacientes de demo en la base');

    const detail = await app.inject({
      method: 'GET',
      url: `/api/patients/${patientId}`,
      headers: { cookie },
    });
    expect(detail.statusCode).toBe(200);
    const detailJson = detail.json() as {
      clinicalContext: { summaryFields: Record<string, string> };
    };
    expect(Object.keys(detailJson.clinicalContext.summaryFields).length).toBeGreaterThan(0);

    const created = await app.inject({
      method: 'POST',
      url: '/api/drafts',
      headers: { cookie },
      payload: {
        patientId,
        draftType: 'evolution_note',
        title: 'Evolución test',
        body: { texto: 'sintético' },
      },
    });
    expect(created.statusCode).toBe(201);
    const draftId = (created.json() as { draft: { id: string } }).draft.id;

    const detailBefore = await app.inject({
      method: 'GET',
      url: `/api/drafts/${draftId}`,
      headers: { cookie },
    });
    expect((detailBefore.json() as { versions: unknown[] }).versions).toHaveLength(1);

    await app.inject({
      method: 'PATCH',
      url: `/api/drafts/${draftId}`,
      headers: { cookie },
      payload: { body: { texto: 'actualización v2' } },
    });

    const detailAfter = await app.inject({
      method: 'GET',
      url: `/api/drafts/${draftId}`,
      headers: { cookie },
    });
    expect((detailAfter.json() as { versions: unknown[] }).versions).toHaveLength(2);

    const illegal = await app.inject({
      method: 'PATCH',
      url: `/api/drafts/${draftId}`,
      headers: { cookie },
      payload: { status: 'approved' },
    });
    expect(illegal.statusCode).toBe(409);

    const notesBefore = await listApprovedNotes(db, patientId);
    const beforeCount = notesBefore.length;

    const approved = await app.inject({
      method: 'POST',
      url: `/api/drafts/${draftId}/approve`,
      headers: { cookie },
    });
    expect(approved.statusCode).toBe(200);

    const notesAfter = await listApprovedNotes(db, patientId);
    expect(notesAfter.length).toBe(beforeCount + 1);
    expect(notesAfter.some((n) => n.title === 'Evolución test')).toBe(true);

    await app.close();
  });
});
