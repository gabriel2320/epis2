#!/usr/bin/env node
/**
 * Habilita IA local EPIS2: Ollama (nativo o Docker) + pull de modelo + verificación.
 * Uso: node scripts/ai-local-enable.mjs
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

function loadDotEnv() {
  const path = resolve(process.cwd(), '.env');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i < 0) continue;
    const key = t.slice(0, i).trim();
    const val = t.slice(i + 1).trim();
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

loadDotEnv();

const OLLAMA_URL = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
const LOCAL_AI_URL = process.env.LOCAL_AI_BASE_URL ?? 'http://127.0.0.1:3002';
const MODEL = process.env.OLLAMA_MODEL ?? 'qwen3:8b';
const COMPOSE_SERVICE = 'ollama';
const CONTAINER = 'epis2-ollama';

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} ${args.join(' ')} exit ${code}`));
    });
  });
}

async function fetchOk(url, path = '') {
  try {
    const res = await fetch(`${url.replace(/\/$/, '')}${path}`, {
      signal: AbortSignal.timeout(5000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

async function getOllamaModels() {
  try {
    const res = await fetch(`${OLLAMA_URL.replace(/\/$/, '')}/api/tags`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return [];
    const body = await res.json();
    return (body.models ?? []).map((m) => m.name);
  } catch {
    return [];
  }
}

function modelInstalled(names, model) {
  const base = model.split(':')[0];
  return names.some((n) => n === model || n.startsWith(`${base}:`) || n.startsWith(`${model}:`));
}

async function waitFor(predicate, label, attempts = 30, ms = 2000) {
  for (let i = 0; i < attempts; i++) {
    if (await predicate()) {
      console.log(`OK — ${label}`);
      return;
    }
    console.log(`… esperando ${label} (${i + 1}/${attempts})`);
    await delay(ms);
  }
  throw new Error(`Timeout: ${label}`);
}

async function ensureOllama() {
  if (await fetchOk(OLLAMA_URL, '/api/tags')) {
    console.log(`1) Ollama ya responde en ${OLLAMA_URL} (instalación nativa o en ejecución)`);
    return 'native';
  }

  if (OLLAMA_URL.includes('host.docker.internal')) {
    throw new Error(
      `Ollama no responde en ${OLLAMA_URL}. Instala Ollama en el host (https://ollama.com), ` +
        `ejecuta "ollama pull ${MODEL}" y deja el servicio en segundo plano.`,
    );
  }

  console.log('1) Ollama no responde — levantando contenedor Docker (perfil bundled-ollama)…');
  try {
    await run('docker', ['compose', '--profile', 'bundled-ollama', 'up', '-d', COMPOSE_SERVICE]);
  } catch (e) {
    console.error(
      '\nNo se pudo levantar Ollama por Docker.',
      'Preferido: Ollama nativo en el host con OLLAMA_BASE_URL=http://127.0.0.1:11434',
      'Opcional: docker compose --profile bundled-ollama up -d ollama\n',
    );
    throw e;
  }

  await waitFor(() => fetchOk(OLLAMA_URL, '/api/tags'), `Ollama en ${OLLAMA_URL}`, 40, 3000);
  return 'docker';
}

async function pullModel(mode) {
  const names = await getOllamaModels();
  if (modelInstalled(names, MODEL)) {
    console.log(`2) Modelo ${MODEL} ya disponible`);
    return;
  }

  console.log(`2) Descargando modelo ${MODEL}…`);
  try {
    if (mode === 'docker') {
      await run('docker', ['exec', CONTAINER, 'ollama', 'pull', MODEL]);
    } else {
      await run('ollama', ['pull', MODEL]);
    }
  } catch (e) {
    const after = await getOllamaModels();
    if (after.length > 0) {
      console.warn(
        `Aviso: pull de ${MODEL} falló. Modelos instalados: ${after.join(', ')}`,
        `\n   Ajusta OLLAMA_MODEL en .env (p. ej. qwen3:8b) y reinicia dev:ai.`,
      );
      return;
    }
    throw e;
  }
}

async function main() {
  console.log('EPIS2 — habilitar IA local\n');

  const mode = await ensureOllama();
  await pullModel(mode);

  const localAiAlready = await fetchOk(LOCAL_AI_URL, '/ready');
  if (!localAiAlready) {
    console.log('3) Inicia el servicio local-ai en otra terminal:');
    console.log('   npm run dev:ai\n');
  } else {
    console.log('3) local-ai ya responde en', LOCAL_AI_URL);
  }

  console.log('\n4) Verificación API (con API en marcha):');
  console.log('   GET /api/ai/status → available: true cuando dev:ai + Ollama están activos\n');

  const names = await getOllamaModels();
  console.log(`Modelos Ollama: ${names.join(', ') || '(ninguno)'}`);
  if (names.length && !modelInstalled(names, MODEL)) {
    console.log(
      `\n⚠ OLLAMA_MODEL=${MODEL} no está en la lista. Actualiza .env o ejecuta: npm run ai:pull-model`,
    );
  }

  console.log('\nListo. Stack IA:');
  console.log(`  Ollama:    ${OLLAMA_URL}`);
  console.log(`  Modelo:    ${MODEL}`);
  console.log(`  local-ai:  ${LOCAL_AI_URL}  → npm run dev:ai`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
