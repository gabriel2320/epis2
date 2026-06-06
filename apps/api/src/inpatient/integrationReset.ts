import postgres from 'postgres';

const ADM_DEMO004 = 'f0000003-0000-4000-8000-000000000001';
const ADM_DEMO005 = 'f0000003-0000-4000-8000-000000000002';
const BED_101A = 'f0000002-0000-4000-8000-000000000001';
const BED_101B = 'f0000002-0000-4000-8000-000000000002';
const BED_102A = 'f0000002-0000-4000-8000-000000000003';

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
  } finally {
    await sql.end({ timeout: 5 });
  }
}
