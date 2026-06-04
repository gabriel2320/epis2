import { eq } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { patients } from '../db/schema.js';
import { listDrafts } from '../clinical/service.js';

const OPEN_DRAFT_STATUSES = new Set(['draft', 'editing', 'ready_for_review']);

export const DEMO_WORK_TASKS = [
  {
    id: 'demo-task-evolution',
    label: 'Redactar evolución del paciente activo',
    commandSample: 'evoluciona al paciente',
  },
  {
    id: 'demo-task-summary',
    label: 'Ver resumen clínico',
    commandSample: 'resume al paciente',
  },
] as const;

export async function getDashboardWorkSummary(db: Database, actorId: string) {
  const drafts = await listDrafts(db);
  const patientRows = await db.select({ id: patients.id, displayName: patients.displayName }).from(patients);
  const nameById = new Map(patientRows.map((p) => [p.id, p.displayName]));

  const toRow = (d: (typeof drafts)[number]) => ({
    id: d.id,
    patientId: d.patientId,
    patientDisplayName: nameById.get(d.patientId) ?? 'Paciente',
    draftType: d.draftType,
    status: d.status,
    title: d.title,
    updatedAt: d.updatedAt.toISOString(),
  });

  const myOpenDrafts = drafts
    .filter((d) => d.createdBy === actorId && OPEN_DRAFT_STATUSES.has(d.status))
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map(toRow);

  const pendingReview = drafts
    .filter((d) => d.status === 'ready_for_review')
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map(toRow);

  return {
    readOnly: true as const,
    myOpenDrafts,
    pendingReview,
    demoTasks: [...DEMO_WORK_TASKS],
  };
}

/** Paciente por id (para tablero paciente V1 parcial). */
export async function getPatientDisplayName(db: Database, patientId: string) {
  const [row] = await db
    .select({ displayName: patients.displayName })
    .from(patients)
    .where(eq(patients.id, patientId))
    .limit(1);
  return row?.displayName ?? null;
}
