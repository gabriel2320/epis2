import { eq } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { clinicalDrafts, patientMedications, patients } from '../db/schema.js';

export async function getPharmacyDashboardSummary(db: Database) {
  const patientRows = await db
    .select({ id: patients.id, displayName: patients.displayName })
    .from(patients);
  const nameById = new Map(patientRows.map((p) => [p.id, p.displayName]));

  const draftRows = await db.select().from(clinicalDrafts);
  const pendingValidations = draftRows
    .filter(
      (d) =>
        d.draftType === 'pharmacy_validation' &&
        ['draft', 'editing', 'ready_for_review'].includes(d.status),
    )
    .map((d) => ({
      id: d.id,
      patientId: d.patientId,
      patientDisplayName: nameById.get(d.patientId) ?? 'Paciente',
      title: d.title,
      status: d.status,
      updatedAt: d.updatedAt.toISOString(),
    }));

  const medRows = await db
    .select()
    .from(patientMedications)
    .where(eq(patientMedications.status, 'active'));

  const reconciliationCandidates = patientRows
    .map((p) => {
      const meds = medRows.filter((m) => m.patientId === p.id);
      if (meds.length < 2) return null;
      return {
        patientId: p.id,
        patientDisplayName: p.displayName,
        activeMedicationCount: meds.length,
        medications: meds.map((m) => m.name).slice(0, 4),
        reason: 'Conciliación medicamentosa pendiente (demo)',
      };
    })
    .filter((r): r is NonNullable<typeof r> => r !== null);

  return {
    readOnly: true as const,
    roleView: 'pharmacist' as const,
    pendingValidations,
    reconciliationCandidates,
    demoTasks: [
      {
        id: 'pharm-task-validation',
        label: 'Validación farmacéutica',
        commandSample: 'validacion farmaceutica',
      },
      {
        id: 'pharm-task-reconciliation',
        label: 'Conciliación medicamentosa',
        commandSample: 'conciliacion medicamentosa',
      },
    ],
  };
}
