import { describeIntegration } from '@epis2/test-fixtures/integration';
import { eq } from 'drizzle-orm';
import { expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { getDatabase } from '../db/client.js';
import { aiRuns, approvals, auditEvents, clinicalNotes } from '../db/schema.js';
import { testApiConfig } from '../testConfig.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

describeIntegration('draft assist trace (MF-SH-01)', () => {
  it('approve asistido persiste approvals.ai_run_id y audit payload', async () => {
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
    expect(patientId).toBeTruthy();

    const [aiRun] = await db
      .insert(aiRuns)
      .values({
        actorId: null,
        blueprintId: 'evolution_note',
        patientId,
        promptHash: 'mf-sh-01-test',
        model: 'test',
        latencyMs: 12,
        status: 'success',
        outputPayload: { suggestedFields: { subjective: 'Asistido' } },
      })
      .returning({ id: aiRuns.id });

    const draftRes = await app.inject({
      method: 'POST',
      url: '/api/drafts',
      headers: { cookie, 'content-type': 'application/json' },
      payload: {
        patientId,
        draftType: 'evolution_note',
        title: 'Trace SH-01',
        body: { subjective: 'Paciente estable', plan: 'Control' },
        assistAiRunId: aiRun!.id,
      },
    });
    expect(draftRes.statusCode).toBe(201);
    const draftId = (draftRes.json() as { draft: { id: string } }).draft.id;

    const approveRes = await app.inject({
      method: 'POST',
      url: `/api/drafts/${draftId}/approve`,
      headers: { cookie },
    });
    expect(approveRes.statusCode).toBe(200);
    const approved = approveRes.json() as { note: { id: string; body: Record<string, unknown> } };
    expect(approved.note.body._epis2AssistTrace).toBeUndefined();

    const [approvalRow] = await db
      .select()
      .from(approvals)
      .where(eq(approvals.draftId, draftId))
      .limit(1);
    expect(approvalRow?.aiRunId).toBe(aiRun!.id);

    const [noteRow] = await db
      .select()
      .from(clinicalNotes)
      .where(eq(clinicalNotes.id, approved.note.id))
      .limit(1);
    expect((noteRow?.body as Record<string, unknown>)._epis2AssistTrace).toBeUndefined();

    const auditRows = await db
      .select()
      .from(auditEvents)
      .where(eq(auditEvents.entityId, draftId))
      .orderBy(auditEvents.at);
    const approvedEvent = auditRows
      .filter((row) => row.eventType === 'clinical.draft.approved')
      .at(-1);
    expect((approvedEvent?.payload as { aiRunId?: string })?.aiRunId).toBe(aiRun!.id);

    await app.close();
  });
});
