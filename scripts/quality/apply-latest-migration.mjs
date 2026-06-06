#!/usr/bin/env node
/**
 * Aplica la migración SQL con número más alto (útil cuando db:migrate completo falla en BD ya migrada).
 */
import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { loadEnvFile } from '../load-env.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const migrationsDir = join(root, 'database', 'migrations');

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('apply-latest-migration FAILED: DATABASE_URL no definida');
    process.exit(1);
  }

  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith('.sql'))
    .sort();
  const latest = files.at(-1);
  if (!latest) {
    console.error('apply-latest-migration FAILED: sin migraciones');
    process.exit(1);
  }

  const content = await readFile(join(migrationsDir, latest), 'utf8');
  const sql = postgres(url, { max: 1 });
  try {
    console.log(`Aplicando ${latest}…`);
    await sql.unsafe(content);
    console.log(`apply-latest-migration OK — ${latest}`);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error('apply-latest-migration FAILED:', err.message ?? err);
  process.exit(1);
});
