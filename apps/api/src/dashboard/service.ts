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
  {
    id: 'demo-task-referral',
    label: 'Solicitar interconsulta (V1)',
    commandSample: 'solicitar interconsulta',
  },
  {
    id: 'demo-task-service',
    label: 'Ver censo del servicio (V2)',
    commandSample: 'ver el servicio',
  },
  {
    id: 'demo-task-nursing',
    label: 'Nota de enfermería (V3)',
    commandSample: 'nota de enfermeria',
  },
  {
    id: 'demo-task-mar',
    label: 'Registrar administración MAR (V3)',
    commandSample: 'registrar mar',
  },
  {
    id: 'demo-task-pharmacy',
    label: 'Validación farmacéutica (V3)',
    commandSample: 'validacion farmaceutica',
  },
] as const;

const NURSE_TASK_IDS = new Set(['demo-task-mar', 'demo-task-nursing']);
const NURSE_DRAFT_TYPES = new Set(['nursing_note', 'medication_administration']);
const PHARMACY_TASK_IDS = new Set(['demo-task-pharmacy']);
const PHARMACY_DRAFT_TYPES = new Set(['pharmacy_validation']);

function filterTasksForRole(role: string) {
  if (role === 'nurse') {
    return DEMO_WORK_TASKS.filter((t) => NURSE_TASK_IDS.has(t.id));
  }
  if (role === 'pharmacist') {
    return DEMO_WORK_TASKS.filter((t) => PHARMACY_TASK_IDS.has(t.id));
  }
  return [...DEMO_WORK_TASKS];
}

function draftVisibleForRole(draftType: string, role: string): boolean {
  if (role === 'nurse') return NURSE_DRAFT_TYPES.has(draftType);
  if (role === 'pharmacist') return PHARMACY_DRAFT_TYPES.has(draftType);
  return true;
}

export async function getDashboardWorkSummary(
  db: Database,
  actorId: string,
  role = 'physician',
) {
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
    .filter(
      (d) =>
        d.createdBy === actorId &&
        OPEN_DRAFT_STATUSES.has(d.status) &&
        draftVisibleForRole(d.draftType, role),
    )
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map(toRow);

  const pendingReview = drafts
    .filter(
      (d) =>
        d.status === 'ready_for_review' && draftVisibleForRole(d.draftType, role),
    )
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .map(toRow);

  return {
    readOnly: true as const,
    roleView: role as 'physician' | 'nurse' | 'pharmacist' | 'admin' | 'auditor',
    myOpenDrafts,
    pendingReview,
    demoTasks: filterTasksForRole(role),
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
