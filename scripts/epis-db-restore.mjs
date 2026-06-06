#!/usr/bin/env node
/**
 * Restaura backup pg_dump generado por npm run db:backup.
 * Uso: DATABASE_URL=... npm run db:restore -- backups/epis2-YYYYMMDD-HHMMSS.sql
 */
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { loadEnvFile } from './load-env.mjs';

loadEnvFile();

const backupPath = process.argv[2];
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('db:restore FAILED: DATABASE_URL no definida');
  process.exit(1);
}
if (!backupPath || !existsSync(backupPath)) {
  console.error('db:restore FAILED: ruta de backup inválida');
  process.exit(1);
}

const sql = readFileSync(backupPath, 'utf8');
const result = spawnSync('psql', [databaseUrl, '-v', 'ON_ERROR_STOP=1', '-f', backupPath], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.status !== 0) {
  console.error('db:restore FAILED: psql exit', result.status);
  process.exit(result.status ?? 1);
}

console.log(`db:restore OK — ${backupPath} (${sql.length} bytes)`);
