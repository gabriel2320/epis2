import postgres from 'postgres';
import { clinicalCaseRecordSchema, type ClinicalCaseRecord } from '@epis2/contracts';
import { recordContentHash } from './normalize.js';

export interface LoadSummary {
  inserted: number;
  updated: number;
  unchanged: number;
}

export async function loadRecords(
  databaseUrl: string,
  records: ClinicalCaseRecord[],
): Promise<LoadSummary> {
  const sql = postgres(databaseUrl, { max: 1 });
  const summary: LoadSummary = { inserted: 0, updated: 0, unchanged: 0 };
  try {
    for (const raw of records) {
      const record = clinicalCaseRecordSchema.parse(raw);
      const hash = recordContentHash(record);
      const existing = await sql<{ source_hash: string }[]>`
        SELECT source_hash FROM clinical_case_staging WHERE case_code = ${record.caseCode}
      `;

      if (existing.length > 0 && existing[0]!.source_hash === hash) {
        summary.unchanged += 1;
        continue;
      }

      await sql`
        INSERT INTO clinical_case_staging (
          case_code, scenario, requires_human_review, payload, source_hash, fetched_at
        ) VALUES (
          ${record.caseCode},
          ${record.clinical.scenario},
          ${record.generation.requiresHumanReview},
          ${sql.json(record as never)},
          ${hash},
          ${record.fetchedAt}
        )
        ON CONFLICT (case_code) DO UPDATE SET
          scenario = EXCLUDED.scenario,
          requires_human_review = EXCLUDED.requires_human_review,
          payload = EXCLUDED.payload,
          source_hash = EXCLUDED.source_hash,
          fetched_at = EXCLUDED.fetched_at,
          updated_at = NOW(),
          review_status = 'pending',
          reviewed_by = NULL,
          reviewed_at = NULL
      `;
      if (existing.length === 0) summary.inserted += 1;
      else summary.updated += 1;
    }
  } finally {
    await sql.end();
  }
  return summary;
}
