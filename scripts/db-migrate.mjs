import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { loadEnvFile } from './load-env.mjs';
import { maskDatabaseUrl, resolveMigrateDatabaseUrl } from './db-url.mjs';

loadEnvFile();

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const migrationsDir = join(root, 'database', 'migrations');

async function main() {
  const url = resolveMigrateDatabaseUrl();
  if (!url) {
    console.error('db:migrate FAILED: DATABASE_URL o DATABASE_MIGRATE_URL no definida');
    process.exit(1);
  }

  const appUrl = process.env.DATABASE_URL;
  if (appUrl && url !== appUrl) {
    console.log(`db:migrate — superuser ${maskDatabaseUrl(url)}`);
    console.log(`         API/tests ${maskDatabaseUrl(appUrl)}`);
  }

  const files = (await readdir(migrationsDir))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  const sql = postgres(url, { max: 1 });
  try {
    for (const file of files) {
      const content = await readFile(join(migrationsDir, file), 'utf8');
      console.log(`Aplicando ${file}…`);
      await sql.unsafe(content);
    }
    console.log(`db:migrate OK — ${files.length} migración(es)`);
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error('db:migrate FAILED:', err.message ?? err);
  process.exit(1);
});
