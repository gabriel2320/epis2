import { describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { getDatabase } from '../db/client.js';
import { listApprovedNotes } from './service.js';

const config = {
  NODE_ENV: 'test' as const,
  API_HOST: '127.0.0.1',
  API_PORT: 3001,
  SESSION_SECRET: 'test-secret-min-16-chars',
  SESSION_COOKIE_NAME: 'epis2_session',
  WEB_ORIGIN: 'http://127.0.0.1:5173',
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
    const patientId = (patients.json() as { patients: { id: string }[] }).patients[0]?.id;
    if (!patientId) throw new Error('Sin pacientes de demo en la base');

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
