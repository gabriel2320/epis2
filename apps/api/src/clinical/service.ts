import { eq, ilike, and } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import {
  approvals,
  clinicalDrafts,
  clinicalNoteVersions,
  clinicalNotes,
  draftVersions,
  encounters,
  patients,
} from '../db/schema.js';
import { appendAudit } from '../audit/store.js';

export type Actor = { id: string; username: string };

export async function searchPatients(db: Database, query?: string) {
  if (query?.trim()) {
    return db
      .select()
      .from(patients)
      .where(
        and(eq(patients.isSynthetic, true), ilike(patients.displayName, `%${query.trim()}%`)),
      )
      .limit(20);
  }
  return db.select().from(patients).where(eq(patients.isSynthetic, true)).limit(50);
}

export async function getPatientById(db: Database, patientId: string) {
  const [row] = await db.select().from(patients).where(eq(patients.id, patientId)).limit(1);
  return row ?? null;
}

export async function listApprovedNotes(db: Database, patientId: string) {
  return db.select().from(clinicalNotes).where(eq(clinicalNotes.patientId, patientId));
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
