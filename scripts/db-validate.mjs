import { readdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const migrationsDir = join(root, 'database', 'migrations');

const MIGRATION_PATTERN = /^\d{3}_[a-z0-9_]+\.sql$/i;
const FORBIDDEN = /\b(DROP\s+DATABASE|TRUNCATE\s+.*CASCADE)\b/i;

async function validateMigrations() {
  const files = (await readdir(migrationsDir)).filter((f) => f.endsWith('.sql')).sort();

  if (files.length === 0) {
    throw new Error('No hay archivos .sql en database/migrations');
  }

  for (const file of files) {
    if (!MIGRATION_PATTERN.test(file)) {
      throw new Error(`Nombre de migración inválido: ${file} (esperado NNN_nombre.sql)`);
    }
    const sql = await readFile(join(migrationsDir, file), 'utf8');
    if (FORBIDDEN.test(sql)) {
      throw new Error(`Migración ${file} contiene sentencias prohibidas`);
    }
    if (!sql.trim()) {
      throw new Error(`Migración vacía: ${file}`);
    }
  }

  return files;
}

async function main() {
  const files = await validateMigrations();
  console.log(`db:validate OK — ${files.length} migración(es): ${files.join(', ')}`);
}

main().catch((err) => {
  console.error('db:validate FAILED:', err.message ?? err);
  process.exit(1);
});
