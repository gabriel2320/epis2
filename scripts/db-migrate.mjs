import { createHash } from 'node:crypto';
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

function checksum(content) {
  // Normaliza CRLF para que el checksum sea estable entre Windows y CI.
  return createHash('sha256').update(content.replace(/\r\n/g, '\n')).digest('hex');
}

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

  const files = (await readdir(migrationsDir)).filter((f) => f.endsWith('.sql')).sort();

  const sql = postgres(url, { max: 1 });
  try {
    // Tabla de control de migraciones (auditoría 4.3): versionado incremental.
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS epis2_schema_migrations (
        filename text PRIMARY KEY,
        checksum text NOT NULL,
        applied_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    const appliedRows = await sql`SELECT filename, checksum FROM epis2_schema_migrations`;
    const applied = new Map(appliedRows.map((r) => [r.filename, r.checksum]));

    // Baseline: DB existente sin tabla de control (re-aplicar todo no es seguro —
    // p.ej. 017 restaura un check antiguo que viola filas con draft types nuevos).
    if (applied.size === 0) {
      const [{ exists: hasSchema }] = await sql`
        SELECT EXISTS (
          SELECT 1 FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = 'clinical_drafts'
        ) AS exists
      `;
      if (hasSchema) {
        for (const file of files) {
          const content = await readFile(join(migrationsDir, file), 'utf8');
          const sum = checksum(content);
          await sql`
            INSERT INTO epis2_schema_migrations (filename, checksum)
            VALUES (${file}, ${sum})
            ON CONFLICT (filename) DO NOTHING
          `;
          applied.set(file, sum);
        }
        console.log(
          `db:migrate — baseline: esquema existente, ${files.length} migración(es) registradas sin re-ejecutar`,
        );
      }
    }

    let appliedCount = 0;
    let skippedCount = 0;
    for (const file of files) {
      const content = await readFile(join(migrationsDir, file), 'utf8');
      const sum = checksum(content);
      const known = applied.get(file);

      if (known === sum) {
        skippedCount += 1;
        continue;
      }
      if (known !== undefined && known !== sum) {
        console.warn(
          `AVISO: ${file} cambió tras aplicarse (checksum distinto) — re-aplicando (SQL idempotente).`,
        );
      }

      console.log(`Aplicando ${file}…`);
      await sql.unsafe(content);
      await sql`
        INSERT INTO epis2_schema_migrations (filename, checksum)
        VALUES (${file}, ${sum})
        ON CONFLICT (filename) DO UPDATE SET checksum = ${sum}, applied_at = now()
      `;
      appliedCount += 1;
    }
    console.log(
      `db:migrate OK — ${files.length} migración(es): ${appliedCount} aplicada(s), ${skippedCount} ya registrada(s)`,
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error('db:migrate FAILED:', err.message ?? err);
  process.exit(1);
});
