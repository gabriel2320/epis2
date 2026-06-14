import postgres from 'postgres';
import { clinicalCaseRecordSchema, type ClinicalCaseRecord } from '@epis2/contracts';
import { stableSimCaseUuids } from '@epis2/test-fixtures/node';

export const BATCH_PROMOTE_ACTOR = 'usr-admin-01';

export type PromoteSummary = {
  promoted: number;
  skipped: number;
};

async function findExistingSimPatientId(
  sql: postgres.Sql,
  identifierSystem: string,
  caseCode: string,
): Promise<string | null> {
  const rows = await sql<{ patient_id: string }[]>`
    SELECT patient_id FROM patient_identifiers
    WHERE system = ${identifierSystem} AND value = ${caseCode}
    LIMIT 1
  `;
  return rows[0]?.patient_id ?? null;
}

export async function promoteClinicalCaseRecordSql(
  sql: postgres.Sql,
  record: ClinicalCaseRecord,
  actorId: string,
): Promise<'promoted' | 'skipped'> {
  const parsed = clinicalCaseRecordSchema.parse(record);
  const stableIds = stableSimCaseUuids(parsed.caseCode);
  const existing = await findExistingSimPatientId(
    sql,
    parsed.epis2Mapping.identifierSystem,
    parsed.caseCode,
  );
  if (existing) return 'skipped';

  const patientId = parsed.epis2Mapping.patientId ?? stableIds.patientId;
  const encounterId = parsed.epis2Mapping.encounterId ?? stableIds.encounterId;

  await sql`
    INSERT INTO patients (id, is_synthetic, display_name, birth_date, sex, created_by)
    VALUES (
      ${patientId},
      true,
      ${parsed.patient.displayName},
      ${parsed.patient.birthDate},
      ${parsed.patient.sex},
      ${actorId}
    )
  `;

  await sql`
    INSERT INTO patient_identifiers (patient_id, system, value, created_by)
    VALUES (
      ${patientId},
      ${parsed.epis2Mapping.identifierSystem},
      ${parsed.caseCode},
      ${actorId}
    )
  `;

  await sql`
    INSERT INTO encounters (id, patient_id, status, created_by)
    VALUES (${encounterId}, ${patientId}, ${parsed.epis2Mapping.encounterStatus}, ${actorId})
  `;

  for (const description of parsed.clinical.problems) {
    await sql`
      INSERT INTO problems (patient_id, encounter_id, description, created_by)
      VALUES (${patientId}, ${encounterId}, ${description}, ${actorId})
    `;
  }

  for (const obs of parsed.clinical.observations) {
    await sql`
      INSERT INTO observations (patient_id, encounter_id, label, value_text, created_by)
      VALUES (${patientId}, ${encounterId}, ${obs.label}, ${obs.valueText}, ${actorId})
    `;
  }

  if (parsed.clinical.medications) {
    for (const med of parsed.clinical.medications) {
      await sql`
        INSERT INTO patient_medications (patient_id, name, dose_text, route, status, created_by)
        VALUES (
          ${patientId},
          ${med.name},
          ${med.doseText ?? null},
          ${med.route ?? null},
          ${med.status},
          ${actorId}
        )
      `;
    }
  }

  if (parsed.clinical.allergies) {
    for (const allergy of parsed.clinical.allergies) {
      await sql`
        INSERT INTO patient_allergies (patient_id, substance, severity, created_by)
        VALUES (${patientId}, ${allergy.substance}, ${allergy.severity ?? 'moderate'}, ${actorId})
      `;
    }
  }

  return 'promoted';
}

export async function promoteRecords(
  databaseUrl: string,
  records: ClinicalCaseRecord[],
  actorId = BATCH_PROMOTE_ACTOR,
): Promise<PromoteSummary> {
  const sql = postgres(databaseUrl, { max: 1 });
  const summary: PromoteSummary = { promoted: 0, skipped: 0 };
  try {
    for (const record of records) {
      const result = await promoteClinicalCaseRecordSql(sql, record, actorId);
      if (result === 'promoted') summary.promoted += 1;
      else summary.skipped += 1;
    }
  } finally {
    await sql.end();
  }
  return summary;
}

export async function approveStagingCases(
  databaseUrl: string,
  caseCodes: string[],
  reviewerId = BATCH_PROMOTE_ACTOR,
): Promise<number> {
  if (caseCodes.length === 0) return 0;
  const sql = postgres(databaseUrl, { max: 1 });
  try {
    const rows = await sql<{ case_code: string }[]>`
      UPDATE clinical_case_staging
      SET
        review_status = 'approved',
        reviewed_by = ${reviewerId},
        reviewed_at = NOW(),
        updated_at = NOW()
      WHERE case_code = ANY(${caseCodes}::text[])
        AND review_status IN ('pending', 'rejected')
      RETURNING case_code
    `;
    return rows.length;
  } finally {
    await sql.end();
  }
}

export async function countSimPatientsInDb(databaseUrl: string): Promise<number> {
  const sql = postgres(databaseUrl, { max: 1 });
  try {
    const rows = await sql<{ count: string }[]>`
      SELECT COUNT(*)::text AS count
      FROM patient_identifiers
      WHERE system = 'EPIS2-SIM'
    `;
    return Number(rows[0]?.count ?? 0);
  } finally {
    await sql.end();
  }
}

export async function promoteApprovedFromStaging(
  databaseUrl: string,
  actorId = BATCH_PROMOTE_ACTOR,
): Promise<PromoteSummary> {
  const sql = postgres(databaseUrl, { max: 1 });
  const summary: PromoteSummary = { promoted: 0, skipped: 0 };
  try {
    const rows = await sql<{ payload: ClinicalCaseRecord }[]>`
      SELECT payload FROM clinical_case_staging
      WHERE review_status = 'approved'
      ORDER BY case_code ASC
    `;
    for (const row of rows) {
      const record = clinicalCaseRecordSchema.parse(row.payload);
      const result = await promoteClinicalCaseRecordSql(sql, record, actorId);
      if (result === 'promoted') summary.promoted += 1;
      else summary.skipped += 1;
    }
  } finally {
    await sql.end();
  }
  return summary;
}
