import { and, eq } from 'drizzle-orm';
import { clinicalCaseRecordSchema, type ClinicalCaseRecord } from '@epis2/contracts';
import { stableSimCaseUuids } from '@epis2/test-fixtures/node';
import type { Database } from '../db/client.js';
import {
  encounters,
  observations,
  patientAllergies,
  patientIdentifiers,
  patientMedications,
  patients,
  problems,
} from '../db/schema.js';

export async function findExistingSimPatientId(
  db: Database,
  identifierSystem: string,
  caseCode: string,
): Promise<string | null> {
  const [row] = await db
    .select({ patientId: patientIdentifiers.patientId })
    .from(patientIdentifiers)
    .where(
      and(eq(patientIdentifiers.system, identifierSystem), eq(patientIdentifiers.value, caseCode)),
    )
    .limit(1);
  return row?.patientId ?? null;
}

export async function promoteClinicalCaseRecord(
  db: Database,
  record: ClinicalCaseRecord,
  actorId: string,
): Promise<'promoted' | 'skipped'> {
  const parsed = clinicalCaseRecordSchema.parse(record);
  const stableIds = stableSimCaseUuids(parsed.caseCode);
  const existing = await findExistingSimPatientId(
    db,
    parsed.epis2Mapping.identifierSystem,
    parsed.caseCode,
  );
  if (existing) return 'skipped';

  const patientId = parsed.epis2Mapping.patientId ?? stableIds.patientId;
  const encounterId = parsed.epis2Mapping.encounterId ?? stableIds.encounterId;

  await db.insert(patients).values({
    id: patientId,
    isSynthetic: true,
    displayName: parsed.patient.displayName,
    birthDate: parsed.patient.birthDate,
    sex: parsed.patient.sex,
    createdBy: actorId,
  });

  await db.insert(patientIdentifiers).values({
    patientId,
    system: parsed.epis2Mapping.identifierSystem,
    value: parsed.caseCode,
    createdBy: actorId,
  });

  await db.insert(encounters).values({
    id: encounterId,
    patientId,
    status: parsed.epis2Mapping.encounterStatus,
    createdBy: actorId,
  });

  for (const description of parsed.clinical.problems) {
    await db.insert(problems).values({
      patientId,
      encounterId,
      description,
      createdBy: actorId,
    });
  }

  for (const obs of parsed.clinical.observations) {
    await db.insert(observations).values({
      patientId,
      encounterId,
      label: obs.label,
      valueText: obs.valueText,
      createdBy: actorId,
    });
  }

  if (parsed.clinical.medications) {
    for (const med of parsed.clinical.medications) {
      await db.insert(patientMedications).values({
        patientId,
        name: med.name,
        doseText: med.doseText ?? null,
        route: med.route ?? null,
        status: med.status,
        createdBy: actorId,
      });
    }
  }

  if (parsed.clinical.allergies) {
    for (const allergy of parsed.clinical.allergies) {
      await db.insert(patientAllergies).values({
        patientId,
        substance: allergy.substance,
        severity: allergy.severity ?? 'moderate',
        createdBy: actorId,
      });
    }
  }

  return 'promoted';
}
