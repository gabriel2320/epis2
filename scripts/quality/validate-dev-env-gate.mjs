#!/usr/bin/env node
/**
 * Valida .env local de desarrollo (Windows/Docker) — no commitea secretos.
 * Uso: npm run quality:dev-env-gate
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const envPath = join(root, '.env');
const errors = [];

if (!existsSync(envPath)) {
  console.error('dev-env-gate FAILED:\n  - falta .env — copiar desde .env.example');
  process.exit(1);
}

const envText = readFileSync(envPath, 'utf8');
/** @type {Record<string, string>} */
const vars = {};
for (const line of envText.split(/\r?\n/)) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eq = trimmed.indexOf('=');
  if (eq === -1) continue;
  vars[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
}

const required = [
  'DATABASE_URL',
  'SESSION_SECRET',
  'OLLAMA_BASE_URL',
  'OLLAMA_MODEL',
  'LOCAL_AI_BASE_URL',
];

for (const key of required) {
  if (!vars[key]) errors.push(`.env sin ${key}`);
}

const dbUrl = vars.DATABASE_URL ?? '';
if (dbUrl && !dbUrl.includes('epis2_app')) {
  errors.push('DATABASE_URL debe usar rol epis2_app (RLS efectivo en tests/API)');
}
if (dbUrl && !dbUrl.includes(':5433/')) {
  errors.push('DATABASE_URL local debe apuntar a puerto host 5433 (docker compose)');
}

if ((vars.OLLAMA_MODEL ?? '') !== 'qwen3:8b') {
  errors.push(`OLLAMA_MODEL debe ser qwen3:8b (actual: ${vars.OLLAMA_MODEL ?? '(vacío)'})`);
}

if (errors.length) {
  console.error('dev-env-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('dev-env-gate OK — .env local alineado con stack Ryzen/Ollama/Docker');
