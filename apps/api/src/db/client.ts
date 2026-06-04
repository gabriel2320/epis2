import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema.js';

export type Database = ReturnType<typeof createDatabase>['db'];

let shared: { db: Database; sql: postgres.Sql } | null = null;

export function createDatabase(databaseUrl: string) {
  const sql = postgres(databaseUrl, { max: 10 });
  const db = drizzle(sql, { schema });
  return { db, sql };
}

export function getDatabase(databaseUrl: string | undefined): Database | null {
  if (!databaseUrl) return null;
  if (!shared) {
    shared = createDatabase(databaseUrl);
  }
  return shared.db;
}

export async function closeDatabase(): Promise<void> {
  if (shared) {
    await shared.sql.end({ timeout: 5 });
    shared = null;
  }
}

export async function pingDatabase(databaseUrl: string): Promise<boolean> {
  const client = postgres(databaseUrl, { max: 1, connect_timeout: 3 });
  try {
    await client`SELECT 1`;
    return true;
  } catch {
    return false;
  } finally {
    await client.end({ timeout: 2 });
  }
}
