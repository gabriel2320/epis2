import { buildClinicalContextDense, type ClinicalContextDensePayload } from '@epis2/clinical-domain';
import type { Database } from '../db/client.js';
import { getPatientClinicalSummary } from './patientClinicalSummary.js';
import { getPatientLongitudinal } from './longitudinal.js';
import { getOpenEncounter } from './service.js';

/** MF-DI-01 — contexto denso determinístico para ficha (API). */
export async function getPatientContextDense(
  db: Database,
  patientId: string,
  options?: { careSettingLabel?: string | null },
): Promise<ClinicalContextDensePayload | null> {
  const [longitudinal, summary, openEncounter] = await Promise.all([
    getPatientLongitudinal(db, patientId),
    getPatientClinicalSummary(db, patientId),
    getOpenEncounter(db, patientId),
  ]);

  const encounters = longitudinal.encounters.map((e) => ({
    startedAt: e.startedAt,
    endedAt: e.endedAt ?? null,
  }));

  if (!summary && longitudinal.problems.length === 0) {
    return buildClinicalContextDense({
      problems: longitudinal.problems,
      medications: longitudinal.medications,
      observations: longitudinal.observations,
      encounters,
      ultimoEncuentroAt: null,
      openEncounterId: openEncounter?.id ?? null,
      careSettingLabel: options?.careSettingLabel ?? null,
    });
  }

  return buildClinicalContextDense({
    problems: longitudinal.problems,
    medications: longitudinal.medications,
    observations: longitudinal.observations,
    encounters,
    ultimoEncuentroAt: summary?.ultimoEncuentroAt ?? null,
    openEncounterId: openEncounter?.id ?? null,
    careSettingLabel: options?.careSettingLabel ?? null,
  });
}
