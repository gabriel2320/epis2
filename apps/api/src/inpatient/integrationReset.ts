import postgres from 'postgres';

const ADM_DEMO004 = 'f0000003-0000-4000-8000-000000000001';
const ADM_DEMO005 = 'f0000003-0000-4000-8000-000000000002';
const BED_101A = 'f0000002-0000-4000-8000-000000000001';
const BED_101B = 'f0000002-0000-4000-8000-000000000002';
const BED_102A = 'f0000002-0000-4000-8000-000000000003';

const MAR_DOSE_WARFARIN = 'f1000001-0000-4000-8000-000000000001';
const MAR_DOSE_CEFTRIAXONE = 'f1000001-0000-4000-8000-000000000002';
const MAR_DOSE_PARACETAMOL = 'f1000001-0000-4000-8000-000000000003';

/** Refresca ventanas MAR demo relativas a NOW() — evita flake en DB local persistente (032). */
export async function refreshMarDemoWindows(databaseUrl: string): Promise<void> {
  const sql = postgres(databaseUrl, { max: 1 });
  try {
    await sql`
      UPDATE mar_scheduled_doses
      SET
        scheduled_at = NOW() + INTERVAL '30 minutes',
        window_start = NOW() - INTERVAL '1 hour',
        window_end = NOW() + INTERVAL '2 hours',
        status = 'scheduled',
        requires_double_check = TRUE
      WHERE id = ${MAR_DOSE_WARFARIN}
    `;
    await sql`
      UPDATE mar_scheduled_doses
      SET
        scheduled_at = NOW() + INTERVAL '4 hours',
        window_start = NOW() + INTERVAL '3 hours',
        window_end = NOW() + INTERVAL '5 hours',
        status = 'scheduled',
        requires_double_check = FALSE
      WHERE id = ${MAR_DOSE_CEFTRIAXONE}
    `;
    await sql`
      UPDATE mar_scheduled_doses
      SET
        scheduled_at = NOW() + INTERVAL '90 minutes',
        window_start = NOW() - INTERVAL '15 minutes',
        window_end = NOW() + INTERVAL '3 hours',
        status = 'scheduled',
        requires_double_check = FALSE
      WHERE id = ${MAR_DOSE_PARACETAMOL}
    `;
  } finally {
    await sql.end({ timeout: 5 });
  }
}

/** Restaura censo demo V2 para tests idempotentes (MF-183). */
export async function resetInpatientDemoCensus(databaseUrl: string): Promise<void> {
  const sql = postgres(databaseUrl, { max: 1 });
  try {
    await sql`
      UPDATE inpatient_admissions
      SET status = 'discharged'
      WHERE status = 'active'
        AND id NOT IN (${ADM_DEMO004}, ${ADM_DEMO005})
    `;
    await sql`
      UPDATE inpatient_admissions
      SET status = 'active', bed_id = ${BED_101A}
      WHERE id = ${ADM_DEMO004}
    `;
    await sql`
      UPDATE inpatient_admissions
      SET status = 'active', bed_id = ${BED_101B}
      WHERE id = ${ADM_DEMO005}
    `;
    await sql`
      UPDATE beds SET status = 'occupied' WHERE id IN (${BED_101A}, ${BED_101B})
    `;
    await sql`UPDATE beds SET status = 'available' WHERE id = ${BED_102A}`;
    // Limpia ingresos de tests (p. ej. DEMO-003 en cadena ingreso MF-158)
    await sql`
      UPDATE inpatient_admissions
      SET status = 'discharged'
      WHERE status = 'active'
        AND id NOT IN (${ADM_DEMO004}, ${ADM_DEMO005})
    `;
    await sql`
      UPDATE beds SET status = 'available'
      WHERE id = ${BED_102A}
        AND NOT EXISTS (
          SELECT 1 FROM inpatient_admissions
          WHERE bed_id = ${BED_102A} AND status = 'active'
        )
    `;
  } finally {
    await sql.end({ timeout: 5 });
  }
}
