/**
 * Journey clínico dorado — automatización API (EPIS2-11).
 * Requiere Postgres: DATABASE_URL + npm run db:migrate
 */
import { and, desc, eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import { buildApp } from '../apps/api/src/app.js';
import { getDatabase } from '../apps/api/src/db/client.js';
import { approvals, auditEvents } from '../apps/api/src/db/schema.js';
import { testApiConfig } from '../apps/api/src/testConfig.js';

const hasDb = Boolean(process.env.DATABASE_URL);

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

async function loginCookie(app: Awaited<ReturnType<typeof buildApp>>) {
  const login = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
  });
  expect(login.statusCode).toBe(200);
  return String(login.headers['set-cookie']).split(';')[0];
}

describe.skipIf(!hasDb)('Golden Clinical Journey — API', () => {
  it('flujo completo: login → paciente demo → comando → borrador → aprobación → auditoría', async () => {
    const app = await buildApp(config);
    const db = getDatabase(config.DATABASE_URL)!;
    const cookie = await loginCookie(app);

    const patientsRes = await app.inject({
      method: 'GET',
      url: '/api/patients',
      headers: { cookie },
    });
    expect(patientsRes.statusCode).toBe(200);
    const patients = (patientsRes.json() as {
      patients: { id: string; demoLabel?: string; isSynthetic?: boolean }[];
    }).patients;
    const patient = patients.find((p) => p.isSynthetic && p.demoLabel === 'DEMO/SINTÉTICO');
    expect(patient?.id).toBeTruthy();
    const patientId = patient!.id;

    const cmdNeedsPatient = await app.inject({
      method: 'POST',
      url: '/api/commands/resolve',
      headers: { cookie },
      payload: { text: 'evolucionar nota de hoy' },
    });
    expect((cmdNeedsPatient.json() as { status: string }).status).toBe('needs_patient');

    const cmdResolved = await app.inject({
      method: 'POST',
      url: '/api/commands/resolve',
      headers: { cookie },
      payload: { text: 'evolucionar nota de hoy', patientId },
    });
    const resolved = cmdResolved.json() as { status: string; routePath?: string; intent?: string };
    expect(resolved.status).toBe('resolved');
    expect(resolved.routePath).toBe('/espacio/evolucion');
    expect(resolved.intent).toBe('create_evolution_draft');

    const journeyTitle = `Journey dorado API ${Date.now()}`;
    const draftRes = await app.inject({
      method: 'POST',
      url: '/api/drafts',
      headers: { cookie },
      payload: {
        patientId,
        draftType: 'evolution_note',
        title: journeyTitle,
        body: {
          subjective: 'Paciente refiere mejoría (journey demo)',
          objective: 'Estable (sintético)',
          assessment: 'Evolución favorable (demo)',
          plan: 'Continuar control ambulatorio',
        },
      },
    });
    expect(draftRes.statusCode).toBe(201);
    const draft = (draftRes.json() as { draft: { id: string; status: string } }).draft;
    expect(['draft', 'editing']).toContain(draft.status);

    const notesBefore = await app.inject({
      method: 'GET',
      url: `/api/patients/${patientId}`,
      headers: { cookie },
    });
    const noteCountBefore = (notesBefore.json() as { notes: unknown[] }).notes.length;

    const approveRes = await app.inject({
      method: 'POST',
      url: `/api/drafts/${draft.id}/approve`,
      headers: { cookie },
    });
    expect(approveRes.statusCode).toBe(200);
    const approved = approveRes.json() as { draft: { status: string }; note: { id: string } };
    expect(approved.draft.status).toBe('approved');

    const notesAfter = await app.inject({
      method: 'GET',
      url: `/api/patients/${patientId}`,
      headers: { cookie },
    });
    expect((notesAfter.json() as { notes: unknown[] }).notes.length).toBe(noteCountBefore + 1);

    const [approvalRow] = await db
      .select()
      .from(approvals)
      .where(eq(approvals.draftId, draft.id))
      .limit(1);
    expect(approvalRow?.noteId).toBe(approved.note.id);

    const auditRows = await db
      .select()
      .from(auditEvents)
      .where(
        and(
          eq(auditEvents.entityId, draft.id),
          eq(auditEvents.eventType, 'clinical.draft.approved'),
        ),
      )
      .orderBy(desc(auditEvents.at))
      .limit(1);
    expect(auditRows.length).toBe(1);

    const fhirDoc = await app.inject({
      method: 'GET',
      url: `/api/fhir/DocumentReference/${approved.note.id}`,
      headers: { cookie },
    });
    expect(fhirDoc.statusCode).toBe(200);
    expect((fhirDoc.json() as { resourceType: string }).resourceType).toBe('DocumentReference');

    await app.close();
  });
});
