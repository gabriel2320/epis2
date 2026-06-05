import { and, eq } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import {
  beds,
  clinicalUnits,
  encounters,
  inpatientAdmissions,
  patients,
} from '../db/schema.js';
import { appendAudit } from '../audit/store.js';
import { getOpenEncounter } from '../clinical/service.js';

const DEFAULT_UNIT_CODE = 'CIRUGIA-DEMO';

async function ensureOpenEncounter(db: Database, patientId: string, actorId: string) {
  const open = await getOpenEncounter(db, patientId);
  if (open) return open;

  const [enc] = await db
    .insert(encounters)
    .values({
      patientId,
      status: 'open',
      createdBy: actorId,
    })
    .returning();
  return enc!;
}

async function getActiveAdmission(db: Database, patientId: string) {
  const [row] = await db
    .select()
    .from(inpatientAdmissions)
    .where(
      and(
        eq(inpatientAdmissions.patientId, patientId),
        eq(inpatientAdmissions.status, 'active'),
      ),
    )
    .limit(1);
  return row ?? null;
}

export async function createInpatientAdmission(
  db: Database,
  input: {
    patientId: string;
    bedId: string;
    unitCode?: string | undefined;
    actorId: string;
    username: string;
  },
) {
  const [patient] = await db
    .select()
    .from(patients)
    .where(eq(patients.id, input.patientId))
    .limit(1);
  if (!patient) throw new Error('Paciente no encontrado');

  const existing = await getActiveAdmission(db, input.patientId);
  if (existing) throw new Error('El paciente ya tiene un ingreso activo');

  const unitCode = input.unitCode ?? DEFAULT_UNIT_CODE;
  const [unit] = await db
    .select()
    .from(clinicalUnits)
    .where(eq(clinicalUnits.code, unitCode))
    .limit(1);
  if (!unit) throw new Error('Unidad no encontrada');

  const [bed] = await db
    .select()
    .from(beds)
    .where(and(eq(beds.id, input.bedId), eq(beds.unitId, unit.id)))
    .limit(1);
  if (!bed || bed.status !== 'available') throw new Error('Cama no disponible');

  const encounter = await ensureOpenEncounter(db, input.patientId, input.actorId);
  const expectedDischargeAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

  const [admission] = await db
    .insert(inpatientAdmissions)
    .values({
      patientId: input.patientId,
      encounterId: encounter.id,
      unitId: unit.id,
      bedId: bed.id,
      status: 'active',
      expectedDischargeAt,
      createdBy: input.actorId,
    })
    .returning();

  await db.update(beds).set({ status: 'occupied' }).where(eq(beds.id, bed.id));

  await appendAudit(db, {
    eventType: 'inpatient.admitted',
    actorId: input.actorId,
    username: input.username,
    entityType: 'inpatient_admission',
    entityId: admission!.id,
    message: `Ingreso hospitalario demo — cama ${bed.bedLabel}`,
    payload: { patientId: input.patientId, bedId: bed.id },
  });

  return {
    admission: {
      id: admission!.id,
      patientId: admission!.patientId,
      bedId: admission!.bedId,
      bedLabel: bed.bedLabel,
      unitCode: unit.code,
      status: admission!.status,
      expectedDischargeAt: admission!.expectedDischargeAt?.toISOString(),
    },
    requiresHumanReview: true as const,
  };
}

export async function transferInpatientAdmission(
  db: Database,
  admissionId: string,
  targetBedId: string,
  actor: { id: string; username: string },
) {
  const [adm] = await db
    .select()
    .from(inpatientAdmissions)
    .where(
      and(
        eq(inpatientAdmissions.id, admissionId),
        eq(inpatientAdmissions.status, 'active'),
      ),
    )
    .limit(1);
  if (!adm) throw new Error('Ingreso activo no encontrado');

  const [targetBed] = await db
    .select()
    .from(beds)
    .where(and(eq(beds.id, targetBedId), eq(beds.unitId, adm.unitId)))
    .limit(1);
  if (!targetBed || targetBed.status !== 'available') {
    throw new Error('Cama destino no disponible');
  }

  const [sourceBed] = await db
    .select()
    .from(beds)
    .where(eq(beds.id, adm.bedId))
    .limit(1);

  await db
    .update(inpatientAdmissions)
    .set({ bedId: targetBedId, status: 'active' })
    .where(eq(inpatientAdmissions.id, admissionId));

  await db.update(beds).set({ status: 'available' }).where(eq(beds.id, adm.bedId));
  await db.update(beds).set({ status: 'occupied' }).where(eq(beds.id, targetBedId));

  await appendAudit(db, {
    eventType: 'inpatient.transferred',
    actorId: actor.id,
    username: actor.username,
    entityType: 'inpatient_admission',
    entityId: admissionId,
    message: `Traslado demo ${sourceBed?.bedLabel ?? '—'} → ${targetBed.bedLabel}`,
    payload: { patientId: adm.patientId, fromBedId: adm.bedId, toBedId: targetBedId },
  });

  return {
    admissionId,
    patientId: adm.patientId,
    fromBedLabel: sourceBed?.bedLabel,
    toBedLabel: targetBed.bedLabel,
    requiresHumanReview: true as const,
  };
}

export async function dischargeInpatientAdmission(
  db: Database,
  admissionId: string,
  actor: { id: string; username: string },
) {
  const [adm] = await db
    .select()
    .from(inpatientAdmissions)
    .where(
      and(
        eq(inpatientAdmissions.id, admissionId),
        eq(inpatientAdmissions.status, 'active'),
      ),
    )
    .limit(1);
  if (!adm) throw new Error('Ingreso activo no encontrado');

  const now = new Date();
  await db
    .update(inpatientAdmissions)
    .set({ status: 'discharged' })
    .where(eq(inpatientAdmissions.id, admissionId));

  await db.update(beds).set({ status: 'available' }).where(eq(beds.id, adm.bedId));

  await db
    .update(encounters)
    .set({ status: 'closed', endedAt: now })
    .where(eq(encounters.id, adm.encounterId));

  await appendAudit(db, {
    eventType: 'inpatient.discharged',
    actorId: actor.id,
    username: actor.username,
    entityType: 'inpatient_admission',
    entityId: admissionId,
    message: 'Alta hospitalaria operativa demo',
    payload: { patientId: adm.patientId, encounterId: adm.encounterId },
  });

  return {
    admissionId,
    patientId: adm.patientId,
    dischargedAt: now.toISOString(),
    epicrisisRoute: '/espacio/epicrisis',
    requiresHumanReview: true as const,
  };
}
