/**
 * Hilo B — cierre de encuentro al aprobar `outpatient_visit` (gap auditoría 2.4).
 * Cubre además el camino transaccional de `approveDraft` (nota + approval + side-effect).
 */
import { describeIntegration } from '@epis2/test-fixtures/integration';
import { and, eq } from 'drizzle-orm';
import { expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { getDatabase } from '../db/client.js';
import { encounters } from '../db/schema.js';
import { testApiConfig } from '../testConfig.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

describeIntegration('closeEncounter (integration)', () => {
  it('aprobar outpatient_visit con closeEncounter cierra el episodio abierto', async () => {
    const app = await buildApp(config);
    const db = getDatabase(config.DATABASE_URL)!;

    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];
    const actorId = (login.json() as { user: { id: string } }).user.id;

    const patientsRes = await app.inject({
      method: 'GET',
      url: '/api/patients',
      headers: { cookie },
    });
    const list = (patientsRes.json() as { patients: { id: string; demoCaseCode?: string }[] })
      .patients;
    const patientId = list.find((p) => p.demoCaseCode === 'DEMO-002')?.id ?? list[0]?.id;
    if (!patientId) throw new Error('Sin pacientes de demo en la base');

    const [encounter] = await db
      .insert(encounters)
      .values({ patientId, status: 'open', createdBy: actorId })
      .returning();
    if (!encounter) throw new Error('No se pudo abrir encuentro de prueba');

    const created = await app.inject({
      method: 'POST',
      url: '/api/drafts',
      headers: { cookie },
      payload: {
        patientId,
        encounterId: encounter.id,
        draftType: 'outpatient_visit',
        title: 'Consulta ambulatoria test',
        body: { motivo: 'control demo', closeEncounter: 'true' },
      },
    });
    expect(created.statusCode).toBe(201);
    const draftId = (created.json() as { draft: { id: string } }).draft.id;

    const approved = await app.inject({
      method: 'POST',
      url: `/api/drafts/${draftId}/approve`,
      headers: { cookie },
    });
    expect(approved.statusCode).toBe(200);
    const approvedJson = approved.json() as {
      draft: { status: string };
      note: { id: string };
    };
    expect(approvedJson.draft.status).toBe('approved');
    expect(approvedJson.note.id).toBeTruthy();

    const [closed] = await db
      .select()
      .from(encounters)
      .where(and(eq(encounters.id, encounter.id), eq(encounters.status, 'closed')));
    expect(closed).toBeDefined();
    expect(closed?.endedAt).not.toBeNull();

    await app.close();
  });
});
