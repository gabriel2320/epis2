import postgres from 'postgres';
import { drugIntelRecordSchema, type DrugIntelRecord } from '@epis2/contracts';
import { recordContentHash } from './normalize.js';

/**
 * Carga idempotente a `drug_intel_staging` (staging, no SoT clínico).
 * Clave: `record_key`. Si el contenido cambió (hash distinto), el registro
 * vuelve a `pending` para forzar nueva revisión humana.
 */

export interface LoadSummary {
  inserted: number;
  updated: number;
  unchanged: number;
}

export async function loadRecords(
  databaseUrl: string,
  records: DrugIntelRecord[],
): Promise<LoadSummary> {
  const sql = postgres(databaseUrl, { max: 1 });
  const summary: LoadSummary = { inserted: 0, updated: 0, unchanged: 0 };
  try {
    for (const raw of records) {
      const record = drugIntelRecordSchema.parse(raw);
      const hash = recordContentHash(record);
      const existing = await sql<{ source_hash: string }[]>`
        SELECT source_hash FROM drug_intel_staging WHERE record_key = ${record.recordKey}
      `;

      if (existing.length > 0 && existing[0]!.source_hash === hash) {
        summary.unchanged += 1;
        continue;
      }

      await sql`
        INSERT INTO drug_intel_staging (
          record_key, product_name, active_ingredient, atc_code,
          requires_human_review, payload, source_hash, fetched_at
        ) VALUES (
          ${record.recordKey},
          ${record.productName},
          ${record.activeIngredient ?? null},
          ${record.atcCode ?? null},
          ${record.correlation.requiresHumanReview},
          ${sql.json(record as never)},
          ${hash},
          ${record.fetchedAt}
        )
        ON CONFLICT (record_key) DO UPDATE SET
          product_name = EXCLUDED.product_name,
          active_ingredient = EXCLUDED.active_ingredient,
          atc_code = EXCLUDED.atc_code,
          requires_human_review = EXCLUDED.requires_human_review,
          payload = EXCLUDED.payload,
          source_hash = EXCLUDED.source_hash,
          fetched_at = EXCLUDED.fetched_at,
          updated_at = NOW(),
          -- Contenido nuevo invalida la revisión anterior.
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
