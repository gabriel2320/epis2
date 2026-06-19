import { DEMO_CLINICAL_CASES } from '@epis2/test-fixtures';
import { describeIntegration } from '@epis2/test-fixtures/integration';
import { and, eq } from 'drizzle-orm';
import { beforeEach, expect, it } from 'vitest';
import { resolveCommand, resolveCommandWithAutoConfirm } from '@epis2/command-registry';
import { buildApp } from '../app.js';
import { getDatabase } from '../db/client.js';
import { runWithRlsContext } from '../db/rlsContext.js';
import {
  beds,
  clinicalNotes,
  inpatientAdmissions,
  patientAllergies,
  problems,
} from '../db/schema.js';
import { resetInpatientDemoCensus } from '../inpatient/integrationReset.js';
import { testApiConfig } from '../testConfig.js';

const config = {
  ...testApiConfig,
  DATABASE_URL: process.env.DATABASE_URL,
};

const BED_102A = 'f0000002-0000-4000-8000-000000000003';
const demo002 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-002')!;

describeIntegration('cadena ingreso hospitalario (MF-158)', () => {
  beforeEach(async () => {
    await resetInpatientDemoCensus(config.DATABASE_URL!);
  });

  it('comando → borrador ingreso → aprobación → admisión activa', async () => {
    const app = await buildApp(config);
    const db = getDatabase(config.DATABASE_URL)!;

    const resolved = resolveCommandWithAutoConfirm({
      text: 'ingreso hospitalario',
      role: 'physician',
      patientId: demo002.patientId,
    });
    expect(resolved.status).toBe('resolved');
    if (resolved.status === 'resolved') {
      expect(resolved.routePath).toBe('/espacio/ingreso');
    }

    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const created = await app.inject({
      method: 'POST',
      url: '/api/drafts',
      headers: { cookie },
      payload: {
        patientId: demo002.patientId,
        draftType: 'admission_note',
        title: 'Ingreso DEMO-002',
        body: {
          admissionReason: 'Observación abdominal',
          clinicalSummary: 'Paciente sintético estable',
          initialPlan: 'Hidratación y analgesia',
          targetBedId: `${BED_102A}|102A — disponible`,
        },
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

    const [admission] = await db
      .select()
      .from(inpatientAdmissions)
      .where(
        and(
          eq(inpatientAdmissions.patientId, demo002.patientId),
          eq(inpatientAdmissions.status, 'active'),
        ),
      );
    expect(admission?.bedId).toBe(BED_102A);

    await db
      .update(inpatientAdmissions)
      .set({ status: 'discharged' })
      .where(
        and(
          eq(inpatientAdmissions.patientId, demo002.patientId),
          eq(inpatientAdmissions.status, 'active'),
        ),
      );
    await db.update(beds).set({ status: 'available' }).where(eq(beds.id, BED_102A));

    await app.close();
  });

  it('aprobación de alergia y problema escribe SoT longitudinal', async () => {
    const app = await buildApp(config);
    const db = getDatabase(config.DATABASE_URL)!;
    const demo001 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-001')!;
    const allergySubstance = `Sulfas demo MF-159-${Date.now()}`;

    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const allergyDraft = await app.inject({
      method: 'POST',
      url: '/api/drafts',
      headers: { cookie },
      payload: {
        patientId: demo001.patientId,
        draftType: 'allergy_entry',
        title: 'Alergia test MF-159',
        body: { substance: allergySubstance, severity: 'moderate', reactionNotes: 'Rash' },
      },
    });
    expect(allergyDraft.statusCode).toBe(201);
    const allergyId = (allergyDraft.json() as { draft: { id: string } }).draft.id;
    const allergyApproved = await app.inject({
      method: 'POST',
      url: `/api/drafts/${allergyId}/approve`,
      headers: { cookie },
    });
    expect(allergyApproved.statusCode).toBe(200);

    const allergies = await db
      .select()
      .from(patientAllergies)
      .where(eq(patientAllergies.patientId, demo001.patientId));
    expect(allergies.some((a) => a.substance === allergySubstance)).toBe(true);

    const problemDraft = await app.inject({
      method: 'POST',
      url: '/api/drafts',
      headers: { cookie },
      payload: {
        patientId: demo001.patientId,
        draftType: 'clinical_problem_entry',
        title: 'Problema test MF-160',
        body: { description: 'Hipertensión demo MF-160', status: 'active' },
      },
    });
    expect(problemDraft.statusCode).toBe(201);
    const problemId = (problemDraft.json() as { draft: { id: string } }).draft.id;
    await app.inject({
      method: 'POST',
      url: `/api/drafts/${problemId}/approve`,
      headers: { cookie },
    });

    const problemRows = await db
      .select()
      .from(problems)
      .where(eq(problems.patientId, demo001.patientId));
    expect(problemRows.some((p) => p.description.includes('MF-160'))).toBe(true);

    await app.close();
  });

  it('comando conciliación → borrador → aprobación → nota clínica (MF-166)', async () => {
    const app = await buildApp(config);
    const db = getDatabase(config.DATABASE_URL)!;
    const demo005 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-005')!;

    const resolved = resolveCommand({
      text: 'conciliacion medicamentosa',
      role: 'pharmacist',
      patientId: demo005.patientId,
    });
    expect(resolved.status).toBe('resolved');
    if (resolved.status === 'resolved') {
      expect(resolved.routePath).toBe('/espacio/conciliacion');
    }

    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'farmacia.demo', demoAuthKey: 'DEMO-CLAVE-FARMACIA' },
    });
    expect(login.statusCode).toBe(200);
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const created = await app.inject({
      method: 'POST',
      url: '/api/drafts',
      headers: { cookie },
      payload: {
        patientId: demo005.patientId,
        draftType: 'medication_reconciliation',
        title: 'Conciliación DEMO-005',
        body: {
          homeMedications: 'Warfarina 5 mg, Omeprazol 20 mg',
          inpatientMedications: 'Warfarina 5 mg, Paracetamol 500 mg',
          discrepancies: 'Omeprazol domiciliario no continuado en hospital',
          resolutionPlan: 'Reiniciar omeprazol si indicación clínica persiste',
          communicationNotes: 'Informado a médico tratante',
        },
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

    const notes = await runWithRlsContext(db, config, undefined, (tx) =>
      tx
        .select()
        .from(clinicalNotes)
        .where(
          and(
            eq(clinicalNotes.patientId, demo005.patientId),
            eq(clinicalNotes.noteType, 'medication_reconciliation'),
          ),
        ),
    );
    expect(notes.length).toBeGreaterThan(0);

    await app.close();
  });

  it('comando traslado → borrador → aprobación → cambio de cama (MF-167)', async () => {
    const app = await buildApp(config);
    const db = getDatabase(config.DATABASE_URL)!;
    const demo004 = DEMO_CLINICAL_CASES.find((c) => c.demoCaseCode === 'DEMO-004')!;

    const resolved = resolveCommand({
      text: 'nota de traslado',
      role: 'physician',
      patientId: demo004.patientId,
    });
    expect(resolved.status).toBe('resolved');
    if (resolved.status === 'resolved') {
      expect(resolved.routePath).toBe('/espacio/traslado');
    }

    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { username: 'medico.demo', demoAuthKey: 'DEMO-CLAVE-MEDICO' },
    });
    const cookie = String(login.headers['set-cookie']).split(';')[0];

    const [before] = await db
      .select()
      .from(inpatientAdmissions)
      .where(
        and(
          eq(inpatientAdmissions.patientId, demo004.patientId),
          eq(inpatientAdmissions.status, 'active'),
        ),
      );
    expect(before?.bedId).toBe('f0000002-0000-4000-8000-000000000001');

    await db.update(beds).set({ status: 'available' }).where(eq(beds.id, BED_102A));

    const created = await app.inject({
      method: 'POST',
      url: '/api/drafts',
      headers: { cookie },
      payload: {
        patientId: demo004.patientId,
        draftType: 'transfer_note',
        title: 'Traslado DEMO-004',
        body: {
          transferReason: 'Mejor monitorización',
          clinicalSummary: 'Postoperatorio estable',
          handoffPlan: 'Continuar analgesia y deambulación',
          targetBedId: `${BED_102A}|102A — disponible`,
        },
      },
    });
    expect(created.statusCode).toBe(201);
    const draftId = (created.json() as { draft: { id: string } }).draft.id;

    const approved = await app.inject({
      method: 'POST',
      url: `/api/drafts/${draftId}/approve`,
      headers: { cookie },
      payload: {
        clinicalOverrideReason: 'Traslado demo autorizado con resultados pendientes de acuse',
      },
    });
    expect(approved.statusCode).toBe(200);

    const [after] = await db
      .select()
      .from(inpatientAdmissions)
      .where(
        and(
          eq(inpatientAdmissions.patientId, demo004.patientId),
          eq(inpatientAdmissions.status, 'active'),
        ),
      );
    expect(after?.bedId).toBe(BED_102A);

    await db
      .update(inpatientAdmissions)
      .set({ bedId: before!.bedId })
      .where(eq(inpatientAdmissions.id, after!.id));
    await db.update(beds).set({ status: 'occupied' }).where(eq(beds.id, before!.bedId));
    await db.update(beds).set({ status: 'available' }).where(eq(beds.id, BED_102A));

    await app.close();
  });
});
