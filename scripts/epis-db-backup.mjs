/**
 * Backup lógico EPIS2 — requiere pg_dump en PATH y DATABASE_URL.
 * Uso: DATABASE_URL=... npm run db:backup
 */
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const backupsDir = join(root, 'backups');

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('db:backup FAILED: DATABASE_URL no definida');
    process.exit(1);
  }

  await mkdir(backupsDir, { recursive: true });
  const outfile = join(backupsDir, `epis2-${timestamp()}.sql`);

  await new Promise((resolve, reject) => {
    const child = spawn('pg_dump', ['--no-owner', '--no-acl', url], {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: process.platform === 'win32',
    });

    const chunks = [];
    child.stdout.on('data', (c) => chunks.push(c));
    child.stderr.on('data', (c) => process.stderr.write(c));

    child.on('error', (err) => {
      if (err.code === 'ENOENT') {
        reject(
          new Error(
            'pg_dump no encontrado. Instale PostgreSQL client tools o use un dump externo.',
          ),
        );
      } else {
        reject(err);
      }
    });

    child.on('close', async (code) => {
      try {
        if (code !== 0) {
          reject(new Error(`pg_dump salió con código ${code}`));
          return;
        }
        await writeFile(outfile, Buffer.concat(chunks));
        resolve();
      } catch (e) {
        reject(e);
      }
    });
  });

  console.log(`db:backup OK — ${outfile}`);
}

main().catch((err) => {
  console.error('db:backup FAILED:', err.message ?? err);
  process.exit(1);
});
