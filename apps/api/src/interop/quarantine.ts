import { desc, eq } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { clinicalDrafts, interopHl7Quarantine, patients } from '../db/schema.js';
import { appendAudit } from '../audit/store.js';
import { mapHl7Message } from './hl7Mapping.js';
import { validateHl7Message } from './hl7.js';

export async function stageHl7Quarantine(
  db: Database,
  rawMessage: string,
  actor: { id: string; username: string },
) {
  const validation = validateHl7Message(rawMessage);
  if (!validation.valid) {
    throw new Error(validation.errors.join('; '));
  }

  const [row] = await db
    .insert(interopHl7Quarantine)
    .values({
      messageType: validation.messageType ?? null,
      rawMessage,
      status: 'quarantine',
      createdBy: actor.id,
    })
    .returning();

  await appendAudit(db, {
    eventType: 'interop.hl7.quarantined',
    actorId: actor.id,
    username: actor.username,
    entityType: 'interop_hl7_quarantine',
    entityId: row!.id,
    message: validation.messageType ?? 'HL7',
  });

  return row!;
}

export async function listHl7Quarantine(db: Database, limit = 20) {
  const rows = await db
    .select()
    .from(interopHl7Quarantine)
    .orderBy(desc(interopHl7Quarantine.stagedAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    messageType: r.messageType ?? undefined,
    status: r.status,
    stagedAt: r.stagedAt.toISOString(),
    proposedDraftId: r.proposedDraftId ?? undefined,
    hasMapping: r.mappedPreview != null,
  }));
}

export async function getHl7MappingPreview(db: Database, quarantineId: string) {
  const [row] = await db
    .select()
    .from(interopHl7Quarantine)
    .where(eq(interopHl7Quarantine.id, quarantineId))
    .limit(1);
  if (!row) return null;

  const preview = mapHl7Message(row.rawMessage);
  await db
    .update(interopHl7Quarantine)
    .set({ mappedPreview: preview, status: 'mapped' })
    .where(eq(interopHl7Quarantine.id, quarantineId));

  return preview;
}

async function resolvePatientId(db: Database, hint?: string) {
  const rows = await db.select({ id: patients.id }).from(patients).limit(5);
  if (hint) {
    const normalized = hint.toLowerCase();
    const match = rows.find((r) => r.id.toLowerCase().includes(normalized.slice(0, 8)));
    if (match) return match.id;
  }
  return rows[0]?.id ?? null;
}

export async function proposeHl7Writeback(
  db: Database,
  quarantineId: string,
  actor: { id: string; username: string },
) {
  const [row] = await db
    .select()
    .from(interopHl7Quarantine)
    .where(eq(interopHl7Quarantine.id, quarantineId))
    .limit(1);
  if (!row) throw new Error('Mensaje en cuarentena no encontrado');
  if (row.status === 'reverted' || row.status === 'rejected') {
    throw new Error('Mensaje ya revertido o rechazado');
  }

  const preview =
    (row.mappedPreview as ReturnType<typeof mapHl7Message> | null) ??
    mapHl7Message(row.rawMessage);
  const draftType = preview.suggestedDraftType ?? 'evolution_note';
  const patientId = await resolvePatientId(db, preview.patientHint);
  if (!patientId) throw new Error('No se pudo resolver paciente demo para borrador');

  const [draft] = await db
    .insert(clinicalDrafts)
    .values({
      patientId,
      draftType,
      title: `HL7 ${preview.messageType} — borrador propuesto`,
      body: preview.fields,
      status: 'draft',
      createdBy: actor.id,
      updatedBy: actor.id,
    })
    .returning();

  await db
    .update(interopHl7Quarantine)
    .set({
      status: 'writeback_proposed',
      mappedPreview: preview,
      proposedDraftId: draft!.id,
    })
    .where(eq(interopHl7Quarantine.id, quarantineId));

  await appendAudit(db, {
    eventType: 'interop.hl7.writeback_proposed',
    actorId: actor.id,
    username: actor.username,
    entityType: 'clinical_draft',
    entityId: draft!.id,
    message: `Borrador desde cuarentena ${quarantineId} — requiere aprobación humana`,
    payload: { quarantineId, draftType },
  });

  return { draft, preview };
}

export async function revertHl7Quarantine(
  db: Database,
  quarantineId: string,
  actor: { id: string; username: string },
) {
  const [row] = await db
    .select()
    .from(interopHl7Quarantine)
    .where(eq(interopHl7Quarantine.id, quarantineId))
    .limit(1);
  if (!row) throw new Error('Mensaje en cuarentena no encontrado');

  if (row.proposedDraftId) {
    await db
      .update(clinicalDrafts)
      .set({ status: 'cancelled', updatedBy: actor.id })
      .where(eq(clinicalDrafts.id, row.proposedDraftId));
  }

  await db
    .update(interopHl7Quarantine)
    .set({
      status: 'reverted',
      revertedAt: new Date(),
      revertedBy: actor.id,
    })
    .where(eq(interopHl7Quarantine.id, quarantineId));

  await appendAudit(db, {
    eventType: 'interop.hl7.reverted',
    actorId: actor.id,
    username: actor.username,
    entityType: 'interop_hl7_quarantine',
    entityId: quarantineId,
    message: 'Cuarentena HL7 revertida — sin commit SoT',
  });

  return { quarantineId, reverted: true as const };
}
