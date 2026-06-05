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
import { DEMO_CLINICAL_CASES } from '@epis2/test-fixtures';

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
    const demo001 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-001');
    const patient =
      patients.find((p) => p.id === demo001?.patientId) ??
      patients.find((p) => p.isSynthetic && p.demoLabel === 'DEMO/SINTÉTICO');
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

    const demo005 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-005');
    if (demo005) {
      const alerts005 = await app.inject({
        method: 'GET',
        url: `/api/patients/${demo005.patientId}/clinical-alerts?blueprintId=prescription&fields=${encodeURIComponent(
          JSON.stringify({ medication: 'Ceftriaxona 1 g IV' }),
        )}`,
        headers: { cookie },
      });
      expect(alerts005.statusCode).toBe(200);
      const aJson = alerts005.json() as { readOnly: boolean; alerts: unknown[] };
      expect(aJson.readOnly).toBe(true);
      expect(aJson.alerts.length).toBeGreaterThan(0);
    }

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

  it('golden-v1-longitudinal-review: documentos, intake, RAG y export', async () => {
    const app = await buildApp(config);
    const cookie = await loginCookie(app);

    const demo001 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-001');
    expect(demo001?.patientId).toBeTruthy();
    const patientId = demo001!.patientId;

    const longitudinal = await app.inject({
      method: 'GET',
      url: `/api/patients/${patientId}/longitudinal`,
      headers: { cookie },
    });
    expect(longitudinal.statusCode).toBe(200);
    const longJson = longitudinal.json() as {
      readOnly: boolean;
      documents: unknown[];
      timeline: unknown[];
    };
    expect(longJson.readOnly).toBe(true);
    expect(longJson.documents.length).toBeGreaterThan(0);
    expect(longJson.timeline.length).toBeGreaterThan(0);

    const docSearch = await app.inject({
      method: 'GET',
      url: `/api/patients/${patientId}/documents/search?q=hemoglobina`,
      headers: { cookie },
    });
    expect(docSearch.statusCode).toBe(200);
    expect((docSearch.json() as { hits: unknown[] }).hits.length).toBeGreaterThan(0);

    const intake = await app.inject({
      method: 'POST',
      url: `/api/patients/${patientId}/documents/intake`,
      headers: { cookie },
      payload: {
        title: 'Journey V1 intake',
        documentType: 'txt',
        textContent: 'Seguimiento laboratorio journey dorado demo',
      },
    });
    expect(intake.statusCode).toBe(201);

    const rag = await app.inject({
      method: 'POST',
      url: '/api/ai/rag/query',
      headers: { cookie },
      payload: { patientId, question: 'laboratorio creatinina' },
    });
    expect(rag.statusCode).toBe(200);
    const ragJson = rag.json() as { citations: unknown[]; readOnly: boolean };
    expect(ragJson.readOnly).toBe(true);
    expect(ragJson.citations.length).toBeGreaterThan(0);

    const exportRes = await app.inject({
      method: 'GET',
      url: `/api/patients/${patientId}/export/summary`,
      headers: { cookie },
    });
    expect(exportRes.statusCode).toBe(200);
    expect(exportRes.body).toContain('EPIS2');

    const pdfExport = await app.inject({
      method: 'GET',
      url: `/api/patients/${patientId}/export/summary?format=pdf`,
      headers: { cookie },
    });
    expect(pdfExport.statusCode).toBe(200);
    expect(String(pdfExport.headers['content-type'])).toContain('application/pdf');

    await app.close();
  });

  it('golden-v2-admission-discharge: censo, traslado, ingreso y alta', async () => {
    const app = await buildApp(config);
    const cookie = await loginCookie(app);

    const service = await app.inject({
      method: 'GET',
      url: '/api/dashboard/service',
      headers: { cookie },
    });
    expect(service.statusCode).toBe(200);
    const serviceJson = service.json() as {
      census: { bedLabel: string; admissionId?: string }[];
      activeOrders: unknown[];
    };
    expect(serviceJson.census.length).toBeGreaterThanOrEqual(3);
    expect(serviceJson.activeOrders.length).toBeGreaterThan(0);

    const demo004Admission = 'f0000003-0000-4000-8000-000000000001';
    const bed102A = 'f0000002-0000-4000-8000-000000000003';
    const transfer = await app.inject({
      method: 'POST',
      url: `/api/inpatient/admissions/${demo004Admission}/transfer`,
      headers: { cookie },
      payload: { targetBedId: bed102A },
    });
    expect(transfer.statusCode).toBe(200);

    const demo001 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-001')!;
    const bed101A = 'f0000002-0000-4000-8000-000000000001';
    const admit = await app.inject({
      method: 'POST',
      url: '/api/inpatient/admissions',
      headers: { cookie },
      payload: { patientId: demo001.patientId, bedId: bed101A },
    });
    expect(admit.statusCode).toBe(201);
    const admissionId = (admit.json() as { admission: { id: string } }).admission.id;

    const discharge = await app.inject({
      method: 'POST',
      url: `/api/inpatient/admissions/${admissionId}/discharge`,
      headers: { cookie },
    });
    expect(discharge.statusCode).toBe(200);

    const evoCmd = await app.inject({
      method: 'POST',
      url: '/api/commands/resolve',
      headers: { cookie },
      payload: {
        text: 'evolucion diaria',
        patientId: DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-005')!.patientId,
      },
    });
    expect(evoCmd.statusCode).toBe(200);
    expect((evoCmd.json() as { routePath: string }).routePath).toBe('/espacio/evolucion');

    await app.close();
  });

  it('golden-v3-mar-nursing: tableros rol, MAR y conciliación', async () => {
    const app = await buildApp(config);
    const demo005 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-005')!;

    const nurseLogin = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'enfermeria.demo', demoAuthKey: 'DEMO-CLAVE-ENFERMERIA' },
    });
    const nurseCookie = String(nurseLogin.headers['set-cookie']).split(';')[0];

    const nursingNote = await app.inject({
      method: 'POST',
      url: '/api/commands/resolve',
      headers: { cookie: nurseCookie },
      payload: { text: 'nota de enfermeria', patientId: demo005.patientId },
    });
    expect(nursingNote.statusCode).toBe(200);
    expect((nursingNote.json() as { routePath: string }).routePath).toBe('/espacio/enfermeria');

    const marCmd = await app.inject({
      method: 'POST',
      url: '/api/commands/resolve',
      headers: { cookie: nurseCookie },
      payload: { text: 'registrar mar', patientId: demo005.patientId },
    });
    expect(marCmd.statusCode).toBe(200);
    expect((marCmd.json() as { routePath: string }).routePath).toBe('/espacio/mar');

    const nursingBoard = await app.inject({
      method: 'GET',
      url: '/api/dashboard/nursing',
      headers: { cookie: nurseCookie },
    });
    expect(nursingBoard.statusCode).toBe(200);
    const nursingJson = nursingBoard.json() as {
      scheduledMar: { medication: string }[];
      roleView: string;
    };
    expect(nursingJson.roleView).toBe('nurse');
    expect(nursingJson.scheduledMar.length).toBeGreaterThan(0);

    const marDraft = await app.inject({
      method: 'POST',
      url: '/api/drafts',
      headers: { cookie: nurseCookie },
      payload: {
        patientId: demo005.patientId,
        encounterId: 'b0000001-0000-4000-8000-000000000005',
        draftType: 'medication_administration',
        title: 'MAR journey V3',
        body: {
          medication: 'Warfarina',
          dose: '5 mg',
          route: 'VO',
          doubleCheckConfirmed: true,
        },
      },
    });
    expect(marDraft.statusCode).toBe(201);
    const marDraftId = (marDraft.json() as { draft: { id: string } }).draft.id;

    const physicianCookie = await loginCookie(app);
    const marApproved = await app.inject({
      method: 'POST',
      url: `/api/drafts/${marDraftId}/approve`,
      headers: { cookie: physicianCookie },
    });
    expect(marApproved.statusCode).toBe(200);

    const pharmLogin = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'farmacia.demo', demoAuthKey: 'DEMO-CLAVE-FARMACIA' },
    });
    const pharmCookie = String(pharmLogin.headers['set-cookie']).split(';')[0];

    const pharmCmd = await app.inject({
      method: 'POST',
      url: '/api/commands/resolve',
      headers: { cookie: pharmCookie },
      payload: { text: 'validacion farmaceutica', patientId: demo005.patientId },
    });
    expect(pharmCmd.statusCode).toBe(200);
    expect((pharmCmd.json() as { routePath: string }).routePath).toBe('/espacio/farmacia');

    const pharmBoard = await app.inject({
      method: 'GET',
      url: '/api/dashboard/pharmacy',
      headers: { cookie: pharmCookie },
    });
    expect(pharmBoard.statusCode).toBe(200);
    const pharmJson = pharmBoard.json() as {
      roleView: string;
      reconciliationCandidates: unknown[];
    };
    expect(pharmJson.roleView).toBe('pharmacist');
    expect(pharmJson.reconciliationCandidates.length).toBeGreaterThan(0);

    await app.close();
  });

  it('golden-v4-interop-ops: auditor read-only, HL7 y bundle', async () => {
    const app = await buildApp(config);
    const demo005 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-005')!;

    const auditorLogin = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'auditor.demo', demoAuthKey: 'DEMO-CLAVE-AUDITOR' },
    });
    const auditorCookie = String(auditorLogin.headers['set-cookie']).split(';')[0];

    const qualityCmd = await app.inject({
      method: 'POST',
      url: '/api/commands/resolve',
      headers: { cookie: auditorCookie },
      payload: { text: 'tablero de calidad' },
    });
    expect(qualityCmd.statusCode).toBe(200);
    expect((qualityCmd.json() as { routePath: string }).routePath).toBe('/epis2/dashboard');

    const quality = await app.inject({
      method: 'GET',
      url: '/api/dashboard/quality',
      headers: { cookie: auditorCookie },
    });
    expect(quality.statusCode).toBe(200);
    const qBody = quality.json() as {
      readOnly: boolean;
      stagingBatches: { sourceSystem: string; status: string }[];
    };
    expect(qBody.readOnly).toBe(true);
    expect(qBody.stagingBatches.some((b) => b.sourceSystem === 'HL7v2-ADT')).toBe(true);

    const hl7 = await app.inject({
      method: 'POST',
      url: '/api/interop/hl7/validate',
      headers: { cookie: auditorCookie, 'content-type': 'application/json' },
      payload: {
        message: 'MSH|^~\\&|EPIS2|LAB|20260101120000||ADT^A01|1|P|2.5',
      },
    });
    expect(hl7.statusCode).toBe(200);
    expect((hl7.json() as { valid: boolean }).valid).toBe(true);

    const physicianCookie = await loginCookie(app);
    const bundle = await app.inject({
      method: 'GET',
      url: `/api/fhir/patients/${demo005.patientId}/bundle`,
      headers: { cookie: physicianCookie },
    });
    expect(bundle.statusCode).toBe(200);
    const allergies = (
      bundle.json() as { entry: { resource: { resourceType: string } }[] }
    ).entry.filter((e) => e.resource.resourceType === 'AllergyIntolerance');
    expect(allergies.length).toBeGreaterThan(0);

    const medLogin = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const medCookie = String(medLogin.headers['set-cookie']).split(';')[0];
    const medAudit = await app.inject({
      method: 'GET',
      url: '/api/audit/events',
      headers: { cookie: medCookie },
    });
    expect(medAudit.statusCode).toBe(403);

    await app.close();
  });

  it('golden-v5-ai-traceable: RAG, resumen y ai_runs sin escritura SoT', async () => {
    const app = await buildApp(config);
    const demo001 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-001')!;
    const cookie = await loginCookie(app);

    const suggest = await app.inject({
      method: 'POST',
      url: '/api/commands/suggest',
      headers: { cookie },
      payload: { text: 'laboratorio hemograma' },
    });
    expect(suggest.statusCode).toBe(200);
    expect((suggest.json() as { readOnly: boolean }).readOnly).toBe(true);

    const rag = await app.inject({
      method: 'POST',
      url: '/api/ai/rag/query',
      headers: { cookie, 'content-type': 'application/json' },
      payload: { patientId: demo001.patientId, question: 'laboratorio' },
    });
    expect(rag.statusCode).toBe(200);
    const ragBody = rag.json() as {
      readOnly: boolean;
      requiresHumanReview: boolean;
      citations: unknown[];
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
      payload: { patientId: demo001.patientId },
    });
    expect(summary.statusCode).toBe(200);
    const sumBody = summary.json() as { requiresHumanReview: boolean; summaryText: string };
    expect(sumBody.requiresHumanReview).toBe(true);
    expect(sumBody.summaryText.length).toBeGreaterThan(20);

    const runs = await app.inject({
      method: 'GET',
      url: `/api/ai/runs?patientId=${demo001.patientId}`,
      headers: { cookie },
    });
    expect(runs.statusCode).toBe(200);
    expect(
      (runs.json() as { runs: { blueprintId: string }[] }).runs.some(
        (r) => r.blueprintId === 'rag_query',
      ),
    ).toBe(true);

    await app.close();
  });
});
