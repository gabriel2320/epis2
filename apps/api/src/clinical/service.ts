import {
  assertPatchDraftStatus,
  buildClinicalSafetyInputFromSummary,
  CHILE_RUT_IDENTIFIER_SYSTEM,
  evaluateDemoClinicalAlerts,
  normalizeRut,
} from '@epis2/clinical-domain';
import {
  DEMO_IDENTIFIER_SYSTEM,
  SYNTHETIC_LABEL,
  getDemoCaseByPatientId,
} from '@epis2/test-fixtures';
import { asc, eq, ilike, and, inArray } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import {
  approvals,
  clinicalDrafts,
  clinicalNoteVersions,
  clinicalNotes,
  draftVersions,
  encounters,
  marAdministrationRecords,
  observations,
  patientAllergies,
  patientIdentifiers,
  patients,
  problems,
} from '../db/schema.js';
import { appendAudit } from '../audit/store.js';
import { createInpatientAdmission, getActiveAdmission, transferInpatientAdmission } from '../inpatient/admissions.js';

export type Actor = { id: string; username: string };

export function patientDemoPresentation(patient: { isSynthetic: boolean }) {
  if (!patient.isSynthetic) {
    return {};
  }
  return {
    isSynthetic: true as const,
    demoLabel: SYNTHETIC_LABEL,
  };
}

export async function getPatientDemoCaseCode(db: Database, patientId: string) {
  const [row] = await db
    .select({ value: patientIdentifiers.value })
    .from(patientIdentifiers)
    .where(
      and(
        eq(patientIdentifiers.patientId, patientId),
        eq(patientIdentifiers.system, DEMO_IDENTIFIER_SYSTEM),
      ),
    )
    .limit(1);
  return row?.value;
}

export async function getPatientClinicalContext(db: Database, patientId: string) {
  const demoCase = getDemoCaseByPatientId(patientId);
  const demoCaseCode = (await getPatientDemoCaseCode(db, patientId)) ?? demoCase?.demoCaseCode;
  const problemRows = await db
    .select({ description: problems.description })
    .from(problems)
    .where(eq(problems.patientId, patientId));
  const observationRows = await db
    .select({ label: observations.label, valueText: observations.valueText })
    .from(observations)
    .where(eq(observations.patientId, patientId));
  const openEncounter = await getOpenEncounter(db, patientId);

  const summaryFields =
    demoCase?.summaryFields ??
    buildSummaryFromClinicalRows(problemRows, observationRows);

  return {
    demoCaseCode,
    openEncounterId: openEncounter?.id,
    problems: problemRows,
    observations: observationRows,
    summaryFields,
  };
}

function buildSummaryFromClinicalRows(
  problemRows: { description: string }[],
  observationRows: { label: string; valueText: string }[],
): Record<string, string> {
  return {
    activeProblems: problemRows.map((p) => p.description).join('\n') || 'Sin problemas (demo)',
    recentEvents: 'Últimas 24 h: sin eventos agudos registrados (sintético)',
    relevantLabs:
      observationRows.map((o) => `${o.label} ${o.valueText}`).join(' · ') ||
      'Sin laboratorio (demo)',
    activeMedications: 'Sin medicación registrada (demo)',
    pendingItems: 'Sin pendientes (demo)',
    clinicalAlerts: SYNTHETIC_LABEL,
  };
}

export async function searchPatients(db: Database, query?: string) {
  const term = query?.trim();
  if (!term) {
    return db.select().from(patients).where(eq(patients.isSynthetic, true)).limit(50);
  }

  const rutNorm = normalizeRut(term);
  if (rutNorm) {
    const idRows = await db
      .select({ patientId: patientIdentifiers.patientId })
      .from(patientIdentifiers)
      .where(
        and(
          eq(patientIdentifiers.system, CHILE_RUT_IDENTIFIER_SYSTEM),
          eq(patientIdentifiers.value, rutNorm),
        ),
      );
    const ids = idRows.map((r) => r.patientId);
    if (ids.length === 0) return [];
    return db
      .select()
      .from(patients)
      .where(and(eq(patients.isSynthetic, true), inArray(patients.id, ids)))
      .limit(20);
  }

  const demoCode = term.toUpperCase();
  if (/^DEMO-\d{3}$/.test(demoCode)) {
    const idRows = await db
      .select({ patientId: patientIdentifiers.patientId })
      .from(patientIdentifiers)
      .where(
        and(
          eq(patientIdentifiers.system, DEMO_IDENTIFIER_SYSTEM),
          eq(patientIdentifiers.value, demoCode),
        ),
      );
    const ids = idRows.map((r) => r.patientId);
    if (ids.length === 0) return [];
    return db
      .select()
      .from(patients)
      .where(and(eq(patients.isSynthetic, true), inArray(patients.id, ids)))
      .limit(20);
  }

  return db
    .select()
    .from(patients)
    .where(and(eq(patients.isSynthetic, true), ilike(patients.displayName, `%${term}%`)))
    .limit(20);
}

export type DemoClinicalAlert = {
  ruleId: string;
  severity: 'warning' | 'critical';
  message: string;
  detail: string;
  source: 'cds' | 'cdr';
};

/** Alertas CDS + CDR (read-only) para UI y asistencia IA. */
export async function getDemoClinicalAlertsForPatient(
  db: Database,
  patientId: string,
  options?: {
    blueprintId?: string;
    currentFields?: Record<string, string>;
  },
): Promise<{ evaluatedAt: string; alerts: DemoClinicalAlert[] } | null> {
  const patient = await getPatientById(db, patientId);
  if (!patient) return null;
  const ctx = await getPatientClinicalContext(db, patientId);
  const allergyRows = await db
    .select({ substance: patientAllergies.substance, severity: patientAllergies.severity })
    .from(patientAllergies)
    .where(eq(patientAllergies.patientId, patientId));
  const safetyOpts: { sex?: string; problems: { description: string }[] } = {
    problems: ctx.problems,
  };
  if (patient.sex) safetyOpts.sex = patient.sex;
  const input = buildClinicalSafetyInputFromSummary(ctx.summaryFields, safetyOpts);
  for (const a of allergyRows) {
    if (!input.allergies.some((x) => x.substance === a.substance)) {
      input.allergies.push({
        substance: a.substance,
        severity:
          a.severity === 'severe' || a.severity === 'mild' ? a.severity : 'moderate',
      });
    }
  }
  const alertOpts: Parameters<typeof evaluateDemoClinicalAlerts>[1] = {};
  if (options?.blueprintId !== undefined) alertOpts.blueprintId = options.blueprintId;
  if (options?.currentFields !== undefined) alertOpts.currentFields = options.currentFields;
  const evaluated = evaluateDemoClinicalAlerts(input, alertOpts);
  return {
    evaluatedAt: evaluated.evaluatedAt,
    alerts: evaluated.warnings.map((w) => ({
      ruleId: w.ruleId,
      severity: w.severity,
      message: w.message,
      detail: w.detail,
      source: w.ruleId.startsWith('cdr.') ? 'cdr' : 'cds',
    })),
  };
}

/** Líneas breves para safetyNotes de IA (compatibilidad). */
export async function getDemoSafetyNotesForPatient(
  db: Database,
  patientId: string,
  options?: {
    blueprintId?: string;
    currentFields?: Record<string, string>;
  },
): Promise<string[]> {
  const result = await getDemoClinicalAlertsForPatient(db, patientId, options);
  if (!result?.alerts.length) return [];
  return result.alerts.map(
    (a) => `- [${a.severity}] ${a.message}: ${a.detail}`,
  );
}

export async function getPatientById(db: Database, patientId: string) {
  const [row] = await db.select().from(patients).where(eq(patients.id, patientId)).limit(1);
  return row ?? null;
}

export async function listApprovedNotes(db: Database, patientId: string) {
  return db.select().from(clinicalNotes).where(eq(clinicalNotes.patientId, patientId));
}

export async function listDrafts(
  db: Database,
  filter: { patientId?: string; status?: string } = {},
) {
  const rows = await db.select().from(clinicalDrafts);
  return rows.filter((row) => {
    if (filter.patientId && row.patientId !== filter.patientId) return false;
    if (filter.status && row.status !== filter.status) return false;
    return true;
  });
}

export async function listDraftVersions(db: Database, draftId: string) {
  return db
    .select()
    .from(draftVersions)
    .where(eq(draftVersions.draftId, draftId))
    .orderBy(asc(draftVersions.versionNo));
}

export async function getDraftDetail(db: Database, draftId: string) {
  const draft = await getDraftById(db, draftId);
  if (!draft) return null;
  const versions = await listDraftVersions(db, draftId);
  return { draft, versions };
}

export async function getDraftById(db: Database, draftId: string) {
  const [row] = await db
    .select()
    .from(clinicalDrafts)
    .where(eq(clinicalDrafts.id, draftId))
    .limit(1);
  return row ?? null;
}

export async function createDraft(
  db: Database,
  actor: Actor,
  input: {
    patientId: string;
    encounterId?: string;
    draftType: string;
    title: string;
    body: Record<string, unknown>;
  },
) {
  const now = new Date();
  const [draft] = await db
    .insert(clinicalDrafts)
    .values({
      patientId: input.patientId,
      encounterId: input.encounterId ?? null,
      draftType: input.draftType,
      status: 'draft',
      title: input.title,
      body: input.body,
      createdBy: actor.id,
      updatedBy: actor.id,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!draft) throw new Error('No se pudo crear borrador');

  await db.insert(draftVersions).values({
    draftId: draft.id,
    versionNo: 1,
    status: draft.status,
    title: draft.title,
    body: draft.body,
    createdBy: actor.id,
  });

  await appendAudit(db, {
    eventType: 'clinical.draft.created',
    actorId: actor.id,
    username: actor.username,
    entityType: 'clinical_draft',
    entityId: draft.id,
  });

  return draft;
}

export async function updateDraft(
  db: Database,
  actor: Actor,
  draftId: string,
  input: { title?: string; body?: Record<string, unknown>; status?: string },
) {
  const existing = await getDraftById(db, draftId);
  if (!existing) return null;
  if (existing.status === 'approved' || existing.status === 'cancelled') {
    throw new Error('Borrador no editable en este estado');
  }

  const nextTitle = input.title ?? existing.title;
  const nextBody = input.body ?? (existing.body as Record<string, unknown>);
  const nextStatus = input.status ?? existing.status;
  if (input.status !== undefined && input.status !== existing.status) {
    assertPatchDraftStatus(existing.status, input.status);
  }
  const now = new Date();

  const [updated] = await db
    .update(clinicalDrafts)
    .set({
      title: nextTitle,
      body: nextBody,
      status: nextStatus,
      updatedAt: now,
      updatedBy: actor.id,
    })
    .where(eq(clinicalDrafts.id, draftId))
    .returning();

  const versions = await db
    .select()
    .from(draftVersions)
    .where(eq(draftVersions.draftId, draftId));
  const versionNo = versions.length + 1;

  await db.insert(draftVersions).values({
    draftId,
    versionNo,
    status: nextStatus,
    title: nextTitle,
    body: nextBody,
    createdBy: actor.id,
  });

  return updated;
}

export async function approveDraft(db: Database, actor: Actor, draftId: string) {
  const draft = await getDraftById(db, draftId);
  if (!draft) return null;
  if (draft.status === 'approved') {
    throw new Error('Borrador ya aprobado');
  }
  if (!['ready_for_review', 'editing', 'draft'].includes(draft.status)) {
    throw new Error('Estado de borrador no permite aprobación');
  }

  const now = new Date();
  const [note] = await db
    .insert(clinicalNotes)
    .values({
      patientId: draft.patientId,
      encounterId: draft.encounterId,
      noteType: draft.draftType,
      title: draft.title,
      body: draft.body,
      createdBy: actor.id,
      updatedBy: actor.id,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  if (!note) throw new Error('No se pudo crear nota clínica');

  await db.insert(clinicalNoteVersions).values({
    noteId: note.id,
    versionNo: 1,
    title: note.title,
    body: note.body,
    createdBy: actor.id,
  });

  await db.insert(approvals).values({
    draftId: draft.id,
    noteId: note.id,
    approvedBy: actor.id,
  });

  const [approvedDraft] = await db
    .update(clinicalDrafts)
    .set({ status: 'approved', updatedAt: now, updatedBy: actor.id })
    .where(eq(clinicalDrafts.id, draftId))
    .returning();

  if (draft.draftType === 'admission_note') {
    const body = draft.body as Record<string, unknown>;
    const rawBed = typeof body.targetBedId === 'string' ? body.targetBedId : '';
    const bedId = rawBed.split('|')[0]?.trim();
    if (bedId) {
      await createInpatientAdmission(db, {
        patientId: draft.patientId,
        bedId,
        actorId: actor.id,
        username: actor.username,
      });
    }
  }

  if (draft.draftType === 'allergy_entry') {
    const body = draft.body as Record<string, unknown>;
    const substance = typeof body.substance === 'string' ? body.substance.trim() : '';
    const severity = typeof body.severity === 'string' ? body.severity : 'moderate';
    if (substance) {
      await db.insert(patientAllergies).values({
        patientId: draft.patientId,
        substance,
        severity,
        createdBy: actor.id,
      });
    }
  }

  if (draft.draftType === 'clinical_problem_entry') {
    const body = draft.body as Record<string, unknown>;
    const description =
      typeof body.description === 'string' ? body.description.trim() : draft.title;
    const status = typeof body.status === 'string' ? body.status : 'active';
    if (description) {
      await db.insert(problems).values({
        patientId: draft.patientId,
        encounterId: draft.encounterId,
        description,
        status,
        createdBy: actor.id,
      });
    }
  }

  if (draft.draftType === 'medication_administration') {
    const body = draft.body as Record<string, unknown>;
    const medication = typeof body.medication === 'string' ? body.medication : draft.title;
    const doseText = typeof body.dose === 'string' ? body.dose : '—';
    const route = typeof body.route === 'string' ? body.route : '—';
    const doubleCheck =
      body.doubleCheckConfirmed === true || body.doubleCheckConfirmed === 'true';
    await db.insert(marAdministrationRecords).values({
      patientId: draft.patientId,
      draftId: draft.id,
      medication,
      doseText,
      route,
      doubleCheck,
      createdBy: actor.id,
    });
  }

  if (draft.draftType === 'transfer_note') {
    const body = draft.body as Record<string, unknown>;
    const rawBed = typeof body.targetBedId === 'string' ? body.targetBedId : '';
    const bedId = rawBed.split('|')[0]?.trim();
    if (bedId) {
      const admission = await getActiveAdmission(db, draft.patientId);
      if (admission) {
        await transferInpatientAdmission(db, admission.id, bedId, {
          id: actor.id,
          username: actor.username,
        });
      }
    }
  }

  await appendAudit(db, {
    eventType: 'clinical.draft.approved',
    actorId: actor.id,
    username: actor.username,
    entityType: 'clinical_draft',
    entityId: draftId,
    message: `Nota ${note.id}`,
  });

  return { draft: approvedDraft, note };
}

export async function getOpenEncounter(db: Database, patientId: string) {
  const [enc] = await db
    .select()
    .from(encounters)
    .where(and(eq(encounters.patientId, patientId), eq(encounters.status, 'open')))
    .limit(1);
  return enc ?? null;
}
