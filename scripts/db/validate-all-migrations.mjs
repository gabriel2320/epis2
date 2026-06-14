import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const MIGRATION_PATTERN = /^\d{3}_[a-z0-9_]+\.sql$/i;
const FORBIDDEN = /\b(DROP\s+DATABASE|TRUNCATE\s+.*CASCADE)\b/i;

/** @param {string} migrationsDir */
export async function validateAllMigrationFiles(migrationsDir) {
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
