#!/usr/bin/env node
/**
 * Entorno de desarrollo local EPIS2 — Postgres, migrate, Ollama y smoke IA.
 * Uso: npm run stack:dev
 *
 * EPIS2_STACK_SKIP_MIGRATE=1  — omitir db:migrate
 * EPIS2_STACK_SKIP_AI=1       — omitir ai:enable
 * EPIS2_STACK_STRICT=1        — fallar si migrate o ai:smoke fallan
 */
import { spawnSync } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';
import { loadEnvFile } from './load-env.mjs';

loadEnvFile();

const strict = process.env.EPIS2_STACK_STRICT === '1';
const skipMigrate = process.env.EPIS2_STACK_SKIP_MIGRATE === '1';
const skipAi = process.env.EPIS2_STACK_SKIP_AI === '1';
const isWin = process.platform === 'win32';

function run(label, cmd, args, { optional = false, shell = cmd === 'docker' } = {}) {
  console.log(`\n▶ ${label}`);
  const bin = isWin && cmd === 'npm' ? 'npm.cmd' : cmd;
  const result = spawnSync(bin, args, {
    stdio: 'inherit',
    env: process.env,
    shell: shell || (isWin && cmd === 'node'),
  });
  if (result.status !== 0) {
    if (optional && !strict) {
      console.warn(`⚠ ${label} — omitido (define EPIS2_STACK_STRICT=1 para fallar)`);
      return false;
    }
    process.exit(result.status ?? 1);
  }
  return true;
}

async function waitPostgres() {
  console.log('\n▶ postgres ready');
  for (let attempt = 1; attempt <= 30; attempt += 1) {
    const probe = spawnSync(
      'docker',
      ['exec', 'epis2-postgres', 'pg_isready', '-U', 'epis2', '-d', 'epis2'],
      { stdio: 'pipe', shell: true },
    );
    if (probe.status === 0) {
      console.log('✓ Postgres listo');
      return;
    }
    if (attempt === 30) {
      console.warn('⚠ Postgres no respondió a pg_isready — continuando');
      return;
    }
    await delay(1000);
  }
}

console.log('EPIS2 stack:dev — Ryzen · Postgres · Ollama nativo · local-ai\n');

run('postgres', 'docker', ['compose', 'up', '-d', 'postgres']);
await waitPostgres();

if (!skipMigrate) {
  run('db:migrate', 'node', ['scripts/db-migrate.mjs'], { optional: !strict });
} else {
  console.log('\n(i) db:migrate omitido — EPIS2_STACK_SKIP_MIGRATE=1');
}

if (!skipAi) {
  run('ai:enable', 'node', ['scripts/ai-local-enable.mjs'], { optional: !strict });
} else {
  console.log('\n(i) ai:enable omitido — EPIS2_STACK_SKIP_AI=1');
}

run('ai:smoke', 'node', ['scripts/ai-smoke.mjs'], { optional: !strict });

const e2eHint = isWin
  ? '$env:EPIS2_LOCAL_CI_E2E="1"; npm run quality:local-ci'
  : 'EPIS2_LOCAL_CI_E2E=1 npm run quality:local-ci';

console.log(`
✓ stack:dev completado

  Terminal 1   npm run dev:api
  Terminal 2   npm run dev:ai      ← requerido para ai:smoke OK
  Terminal 3   npm run dev:web

  Verificación   npm run quality:local-ci
  E2E local      ${e2eHint}
  Evals Ollama   npm run dev:ai && npm run ai:evals:live
  Subagentes dev npm run dev:agent:orchestrate
  Plan Ollama    npm run dev:agent:ollama   (opcional, JSON estructurado)

  Ollama: ${process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434'}
  Modelo: ${process.env.OLLAMA_MODEL ?? 'qwen3:8b'}
  DB API: ${process.env.DATABASE_URL ?? '(sin .env)'}
`);
