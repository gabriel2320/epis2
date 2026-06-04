import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export type DatabaseClient = ReturnType<typeof drizzle>;

export function createDbClient(databaseUrl: string): DatabaseClient {
  const client = postgres(databaseUrl, { max: 1 });
  return drizzle(client);
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
