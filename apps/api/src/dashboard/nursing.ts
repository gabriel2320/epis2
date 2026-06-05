import { and, eq, gte, lte } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { clinicalDrafts, marScheduledDoses, patients } from '../db/schema.js';

const NURSE_DRAFT_TYPES = new Set(['nursing_note', 'medication_administration']);

export async function getNursingDashboardSummary(db: Database, actorId: string) {
  const now = new Date();
  const patientRows = await db
    .select({ id: patients.id, displayName: patients.displayName })
    .from(patients);
  const nameById = new Map(patientRows.map((p) => [p.id, p.displayName]));

  const scheduled = await db
    .select()
    .from(marScheduledDoses)
    .where(
      and(
        eq(marScheduledDoses.status, 'scheduled'),
        lte(marScheduledDoses.windowStart, now),
        gte(marScheduledDoses.windowEnd, now),
      ),
    );

  const draftRows = await db.select().from(clinicalDrafts);
  const openStatuses = new Set(['draft', 'editing', 'ready_for_review']);

  const nursingDrafts = draftRows
    .filter(
      (d) =>
        NURSE_DRAFT_TYPES.has(d.draftType) &&
        openStatuses.has(d.status) &&
        (d.createdBy === actorId || d.status === 'ready_for_review'),
    )
    .map((d) => ({
      id: d.id,
      patientId: d.patientId,
      patientDisplayName: nameById.get(d.patientId) ?? 'Paciente',
      draftType: d.draftType,
      status: d.status,
      title: d.title,
      updatedAt: d.updatedAt.toISOString(),
    }));

  return {
    readOnly: true as const,
    roleView: 'nurse' as const,
    scheduledMar: scheduled.map((s) => ({
      id: s.id,
      patientId: s.patientId,
      patientDisplayName: nameById.get(s.patientId) ?? 'Paciente',
      medication: s.medication,
      doseText: s.doseText,
      route: s.route,
      scheduledAt: s.scheduledAt.toISOString(),
      windowStart: s.windowStart.toISOString(),
      windowEnd: s.windowEnd.toISOString(),
      requiresDoubleCheck: s.requiresDoubleCheck,
      status: s.status as 'scheduled' | 'administered' | 'missed' | 'held',
    })),
    nursingDrafts,
    demoTasks: [
      {
        id: 'nurse-task-mar',
        label: 'Registrar administración MAR',
        commandSample: 'registrar mar',
      },
      {
        id: 'nurse-task-nursing-note',
        label: 'Nota de enfermería',
        commandSample: 'nota de enfermeria',
      },
    ],
  };
}
