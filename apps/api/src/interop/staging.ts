import { desc } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { interopStagingBatches } from '../db/schema.js';

export async function listInteropStagingBatches(db: Database) {
  const rows = await db
    .select()
    .from(interopStagingBatches)
    .orderBy(desc(interopStagingBatches.stagedAt))
    .limit(20);

  return rows.map((b) => ({
    id: b.id,
    sourceSystem: b.sourceSystem,
    batchLabel: b.batchLabel,
    status: b.status,
    recordCount: b.recordCount,
    stagedAt: b.stagedAt.toISOString(),
    notes: b.notes ?? undefined,
  }));
}
