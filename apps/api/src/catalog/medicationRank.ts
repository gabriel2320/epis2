import { INSTITUTIONAL_MEDICATION_WEIGHTS, rankCatalogEntries } from '@epis2/clinical-domain';
import type { ClinicalCatalogEntry } from '@epis2/contracts';
import { and, asc, eq, ilike } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { clinicalCatalogStaging } from '../db/schema.js';
import { getOperationalMemoryForUser } from '../user/operationalMemory.js';
import type { AppConfig } from '../config.js';
import type { SessionClaims } from '../auth/sessionToken.js';

export async function searchRankedMedicationCatalog(
  db: Database,
  config: Pick<AppConfig, 'RLS_MODE'>,
  session: SessionClaims,
  input: { q: string; limit: number; frequentOnly?: boolean | undefined },
): Promise<ClinicalCatalogEntry[]> {
  const conditions = [
    eq(clinicalCatalogStaging.catalogCode, 'medication'),
    eq(clinicalCatalogStaging.status, 'active'),
  ];
  if (input.q.trim()) {
    conditions.push(ilike(clinicalCatalogStaging.label, `%${input.q.trim()}%`));
  }
  const fetchLimit = input.frequentOnly ? 100 : Math.max(input.limit * 3, 50);
  const rows = await db
    .select({
      entryCode: clinicalCatalogStaging.entryCode,
      label: clinicalCatalogStaging.label,
    })
    .from(clinicalCatalogStaging)
    .where(and(...conditions))
    .orderBy(asc(clinicalCatalogStaging.label))
    .limit(fetchLimit);

  const memory = await getOperationalMemoryForUser(db, config, session);
  return rankCatalogEntries({
    items: rows,
    query: input.q,
    frequentOnly: input.frequentOnly,
    getKey: (item) => item.entryCode,
    getSearchText: (item) => item.label,
    personalUsage: memory.global.catalogUsage.medication,
    institutionalWeights: INSTITUTIONAL_MEDICATION_WEIGHTS,
    limit: input.limit,
  });
}
