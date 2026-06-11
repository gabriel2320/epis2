import type { PatientClinicalSummaryResponse } from '@epis2/contracts';
import { copy } from '@epis2/design-system';

/** MF-CHILE-UI-01 — overlay read model SQL sobre summaryFields del contexto clínico. */
export function mergeClinicalSummaryFields(
  base: Record<string, string>,
  sql: PatientClinicalSummaryResponse | null | undefined,
): Record<string, string> {
  if (!sql) return { ...base };

  const merged = { ...base };

  if (sql.problemasActivos?.trim()) {
    merged.activeProblems = sql.problemasActivos;
  }
  if (sql.medicamentosActivos?.trim()) {
    merged.activeMedications = sql.medicamentosActivos;
  }
  if (sql.alergiasCriticas?.trim()) {
    merged.clinicalAlerts = sql.alergiasCriticas;
  }
  if (sql.hospitalizado) {
    const badge = copy.clinicalSummary.hospitalizedBadge;
    merged.clinicalAlerts = merged.clinicalAlerts
      ? `${merged.clinicalAlerts} · ${badge}`
      : badge;
  }
  if (sql.ultimoEncuentroAt) {
    const label = new Date(sql.ultimoEncuentroAt).toLocaleString('es-CL', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
    const line = `${copy.clinicalSummary.lastEncounter}: ${label}`;
    merged.recentEvents = merged.recentEvents?.trim()
      ? `${line}\n${merged.recentEvents}`
      : line;
  }
  if (sql.previsionResumen?.trim()) {
    merged.coveragePrevision = sql.previsionResumen;
  }

  return merged;
}
