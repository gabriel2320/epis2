import { sql } from 'drizzle-orm';
import type { SessionClaims } from '../auth/sessionToken.js';
import type { AppConfig } from '../config.js';
import type { Database } from './client.js';
import { parseRlsMode } from './rls.js';

export async function runWithRlsContext<T>(
  db: Database,
  config: Pick<AppConfig, 'RLS_MODE'>,
  session: SessionClaims | undefined,
  fn: (tx: Database) => Promise<T>,
): Promise<T> {
  const mode = parseRlsMode(config.RLS_MODE);

  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('epis2.rls_mode', ${mode}, true)`);
    if (session) {
      await tx.execute(sql`SELECT set_config('epis2.actor_id', ${session.sub}, true)`);
      await tx.execute(sql`SELECT set_config('epis2.actor_role', ${session.role}, true)`);
    }
    return fn(tx as unknown as Database);
  });
}
