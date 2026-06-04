import { and, eq, isNull } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import {
  beds,
  clinicalCriticalResults,
  clinicalUnits,
  inpatientAdmissions,
  patientIdentifiers,
  patients,
} from '../db/schema.js';
import { listDrafts } from '../clinical/service.js';

const DEFAULT_UNIT_CODE = 'CIRUGIA-DEMO';

export async function getServiceDashboardSummary(
  db: Database,
  unitCode = DEFAULT_UNIT_CODE,
) {
  const [unit] = await db
    .select()
    .from(clinicalUnits)
    .where(eq(clinicalUnits.code, unitCode))
    .limit(1);

  if (!unit) {
    return {
      readOnly: true as const,
      unitCode,
      unitName: unitCode,
      census: [],
      unacknowledgedCriticals: [],
      probableDischarges: [],
      pendingWorkItems: [],
    };
  }

  const bedRows = await db
    .select({
      bedId: beds.id,
      bedLabel: beds.bedLabel,
      status: beds.status,
    })
    .from(beds)
    .where(eq(beds.unitId, unit.id));

  const activeAdmissions = await db
    .select({
      bedId: inpatientAdmissions.bedId,
      patientId: inpatientAdmissions.patientId,
      expectedDischargeAt: inpatientAdmissions.expectedDischargeAt,
      displayName: patients.displayName,
    })
    .from(inpatientAdmissions)
    .innerJoin(patients, eq(inpatientAdmissions.patientId, patients.id))
    .where(
      and(eq(inpatientAdmissions.unitId, unit.id), eq(inpatientAdmissions.status, 'active')),
    );

  const admissionByBed = new Map(activeAdmissions.map((a) => [a.bedId, a]));

  const demoCodes = await db
    .select({ patientId: patientIdentifiers.patientId, value: patientIdentifiers.value })
    .from(patientIdentifiers)
    .where(eq(patientIdentifiers.system, 'EPIS2-DEMO'));

  const demoByPatient = new Map(demoCodes.map((d) => [d.patientId, d.value]));

  const census = bedRows.map((b) => {
    const adm = admissionByBed.get(b.bedId);
    return {
      bedId: b.bedId,
      bedLabel: b.bedLabel,
      status: b.status as 'available' | 'occupied' | 'blocked',
      patientId: adm?.patientId,
      patientDisplayName: adm?.displayName,
      demoCaseCode: adm ? demoByPatient.get(adm.patientId) : undefined,
    };
  });

  const criticalRows = await db
    .select({
      id: clinicalCriticalResults.id,
      patientId: clinicalCriticalResults.patientId,
      label: clinicalCriticalResults.label,
      valueText: clinicalCriticalResults.valueText,
      severity: clinicalCriticalResults.severity,
      observedAt: clinicalCriticalResults.observedAt,
      displayName: patients.displayName,
    })
    .from(clinicalCriticalResults)
    .innerJoin(patients, eq(clinicalCriticalResults.patientId, patients.id))
    .where(isNull(clinicalCriticalResults.acknowledgedAt));

  const admittedPatientIds = new Set(activeAdmissions.map((a) => a.patientId));
  const unacknowledgedCriticals = criticalRows
    .filter((c) => admittedPatientIds.has(c.patientId))
    .map((c) => ({
      id: c.id,
      patientId: c.patientId,
      patientDisplayName: c.displayName,
      label: c.label,
      valueText: c.valueText,
      severity: c.severity as 'high' | 'critical',
      observedAt: c.observedAt.toISOString(),
    }));

  const probableDischarges = activeAdmissions
    .filter((a) => a.expectedDischargeAt != null)
    .map((a) => {
      const bed = bedRows.find((b) => b.bedId === a.bedId);
      return {
        patientId: a.patientId,
        patientDisplayName: a.displayName,
        bedLabel: bed?.bedLabel ?? '—',
        reason: 'Alta prevista en ventana demo (48 h)',
      };
    });

  const drafts = await listDrafts(db);
  const pendingWorkItems = drafts
    .filter((d) => d.status === 'ready_for_review' && admittedPatientIds.has(d.patientId))
    .slice(0, 8)
    .map((d) => ({
      id: d.id,
      label: d.title,
      patientId: d.patientId,
      commandSample: 'revisa borrador pendiente',
    }));

  return {
    readOnly: true as const,
    unitCode: unit.code,
    unitName: unit.name,
    census,
    unacknowledgedCriticals,
    probableDischarges,
    pendingWorkItems,
  };
}

export async function acknowledgeCriticalResult(
  db: Database,
  criticalId: string,
  actorId: string,
) {
  const [row] = await db
    .select()
    .from(clinicalCriticalResults)
    .where(eq(clinicalCriticalResults.id, criticalId))
    .limit(1);
  if (!row) return null;
  if (row.acknowledgedAt) return row;

  const now = new Date();
  await db
    .update(clinicalCriticalResults)
    .set({ acknowledgedAt: now, acknowledgedBy: actorId })
    .where(eq(clinicalCriticalResults.id, criticalId));

  return { ...row, acknowledgedAt: now, acknowledgedBy: actorId };
}
