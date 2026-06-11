import { sql } from 'drizzle-orm';
import type { Database } from '../db/client.js';

export type PatientClinicalSummaryRow = {
  patient_id: string;
  display_name: string;
  birth_date: string | null;
  sex: string | null;
  edad_anios: number | null;
  prevision_resumen: string | null;
  alergias_criticas: string | null;
  problemas_activos: string | null;
  medicamentos_activos: string | null;
  ultimo_encuentro_at: Date | null;
  hospitalizado: boolean;
  refreshed_at: Date;
};

export async function getPatientClinicalSummary(db: Database, patientId: string) {
  const rows = await db.execute<PatientClinicalSummaryRow>(sql`
    SELECT *
    FROM patient_clinical_summary
    WHERE patient_id = ${patientId}::uuid
    LIMIT 1
  `);
  const row = rows[0];
  if (!row) return null;

  return {
    patientId: row.patient_id,
    displayName: row.display_name,
    birthDate: row.birth_date,
    sex: row.sex,
    edadAnios: row.edad_anios,
    previsionResumen: row.prevision_resumen,
    alergiasCriticas: row.alergias_criticas,
    problemasActivos: row.problemas_activos,
    medicamentosActivos: row.medicamentos_activos,
    ultimoEncuentroAt: row.ultimo_encuentro_at?.toISOString() ?? null,
    hospitalizado: Boolean(row.hospitalizado),
    refreshedAt: row.refreshed_at.toISOString(),
  };
}
