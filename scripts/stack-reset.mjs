#!/usr/bin/env node
/**
 * Reset Postgres local (Docker volume) + migraciones limpias.
 * Uso: npm run stack:reset
 *
 * Destructivo: borra todos los datos del contenedor epis2-postgres.
 */
import { spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { loadEnvFile } from './load-env.mjs';

loadEnvFile();

const isWin = process.platform === 'win32';

function run(label, cmd, args, { shell = cmd === 'docker' } = {}) {
  console.log(`\n▶ ${label}`);
  const bin = isWin && cmd === 'npm' ? 'npm.cmd' : cmd;
  const result = spawnSync(bin, args, {
    stdio: 'inherit',
    env: process.env,
    shell: shell || (isWin && cmd === 'node'),
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('EPIS2 stack:reset — borra volumen Postgres y reaplica migraciones\n');

run('docker compose down -v', 'docker', ['compose', 'down', '-v']);
run('docker compose up -d postgres', 'docker', ['compose', 'up', '-d', 'postgres']);

console.log('\n▶ esperando Postgres…');
await delay(5000);

run('db:migrate', 'node', ['scripts/db-migrate.mjs']);

console.log('\n✓ stack:reset OK — volumen limpio, 32 migraciones aplicadas');
console.log('  Siguiente: npm run stack:dev  (Ollama smoke) o npm run dev:api');
