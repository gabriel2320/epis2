import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateAllMigrationFiles } from './db/validate-all-migrations.mjs';
import { validateChileMigrations } from './db/validate-chile-migrations.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const migrationsDir = join(root, 'database', 'migrations');

async function main() {
  const files = await validateAllMigrationFiles(migrationsDir);
  const chile = await validateChileMigrations(root);
  console.log(
    `db:validate OK — ${files.length} migración(es); Chile 035–040: ${chile.count} checksum(s) vs ${chile.controlTable}`,
  );
}

main().catch((err) => {
  console.error('db:validate FAILED:', err.message ?? err);
  process.exit(1);
});
