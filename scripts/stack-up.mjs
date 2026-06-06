#!/usr/bin/env node
/**
 * Levanta infraestructura demo: Postgres + Ollama (Docker) y verifica IA local.
 */
import { spawnSync } from 'node:child_process';
import { loadEnvFile } from './load-env.mjs';

loadEnvFile();

function run(label, cmd, args, opts = {}) {
  console.log(`\n▶ ${label}`);
  const bin = process.platform === 'win32' && cmd === 'npm' ? 'npm.cmd' : cmd;
  const result = spawnSync(bin, args, {
    stdio: 'inherit',
    env: process.env,
    shell: cmd === 'docker',
    ...opts,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('EPIS2 stack:up — Postgres + Ollama (host)\n');

run('postgres', 'docker', ['compose', 'up', '-d', 'postgres']);
run('migrate', 'npm', ['run', 'db:migrate']);

console.log('\n▶ ai:enable (Ollama nativo en host — OLLAMA_BASE_URL / OLLAMA_MODEL desde .env)');
console.log('   Contenedor Ollama opcional: docker compose --profile bundled-ollama up -d ollama\n');
run('ai:enable', 'npm', ['run', 'ai:enable']);

console.log(`
✓ Stack listo

  npm run dev:api   # terminal 1
  npm run dev:ai    # terminal 2 (opcional)
  npm run dev:web   # terminal 3

  npm run test:e2e  # journey UI con Playwright
  npm run ai:smoke  # verificar Ollama + local-ai (MF-187)
`);
