#!/usr/bin/env node
/**
 * Aplica la migración SQL con número más alto (útil cuando db:migrate completo falla en BD ya migrada).
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { loadEnvFile } from '../load-env.mjs';
import { resolveMigrateDatabaseUrl } from '../db-url.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const migrationsDir = join(root, 'database', 'migrations');

async function main() {
  const url = resolveMigrateDatabaseUrl();
  if (!url) {
    console.error('apply-latest-migration FAILED: DATABASE_URL o DATABASE_MIGRATE_URL no definida');
    process.exit(1);
  }

  const files = (await readdir(migrationsDir)).filter((f) => f.endsWith('.sql')).sort();
  const toApply = files.slice(-2);
  if (toApply.length === 0) {
    console.error('apply-latest-migration FAILED: sin migraciones');
    process.exit(1);
  }

  const sql = postgres(url, { max: 1 });
  try {
    for (const file of toApply) {
      const content = await readFile(join(migrationsDir, file), 'utf8');
      console.log(`Aplicando ${file}…`);
      await sql.unsafe(content);
    }
    console.log(`apply-latest-migration OK — ${toApply.join(', ')}`);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error('apply-latest-migration FAILED:', err.message ?? err);
  process.exit(1);
});
