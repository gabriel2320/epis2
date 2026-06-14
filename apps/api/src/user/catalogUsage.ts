import { bumpUsageCount, type CatalogUsageDomain } from '@epis2/clinical-domain';
import type { OperationalCatalogUsage } from '@epis2/contracts';
import { and, eq } from 'drizzle-orm';
import type { Database } from '../db/client.js';
import { userOperationalMemory } from '../db/schema.js';
import { runWithRlsContext } from '../db/rlsContext.js';
import type { AppConfig } from '../config.js';
import type { SessionClaims } from '../auth/sessionToken.js';
import { OPERATIONAL_MEMORY_GLOBAL_SCOPE, parseGlobalPayload } from './operationalMemory.logic.js';

async function upsertGlobalPayload(db: Database, userId: string, payload: unknown) {
  const now = new Date();
  await db
    .insert(userOperationalMemory)
    .values({ userId, scope: OPERATIONAL_MEMORY_GLOBAL_SCOPE, payload, updatedAt: now })
    .onConflictDoUpdate({
      target: [userOperationalMemory.userId, userOperationalMemory.scope],
      set: { payload, updatedAt: now },
    });
}

export async function bumpUserCatalogUsage(
  db: Database,
  config: Pick<AppConfig, 'RLS_MODE'>,
  session: SessionClaims,
  domain: CatalogUsageDomain,
  key: string,
): Promise<OperationalCatalogUsage> {
  return runWithRlsContext(db, config, session, async (tx) => {
    const [row] = await tx
      .select()
      .from(userOperationalMemory)
      .where(
        and(
          eq(userOperationalMemory.userId, session.sub),
          eq(userOperationalMemory.scope, OPERATIONAL_MEMORY_GLOBAL_SCOPE),
        ),
      )
      .limit(1);
    const globalPayload = parseGlobalPayload(row?.payload);
    const nextUsage: OperationalCatalogUsage = {
      ...globalPayload.catalogUsage,
      [domain]: bumpUsageCount(globalPayload.catalogUsage[domain], key),
    };
    await upsertGlobalPayload(tx, session.sub, {
      ...globalPayload,
      catalogUsage: nextUsage,
    });
    return nextUsage;
  });
}
