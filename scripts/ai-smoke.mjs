#!/usr/bin/env node
/**
 * MF-187 — Smoke Ollama + local-ai (no bloqueante en CI).
 */
import { loadEnvFile } from './load-env.mjs';

loadEnvFile();

const OLLAMA_URL = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
const LOCAL_AI_URL = process.env.LOCAL_AI_BASE_URL ?? 'http://127.0.0.1:3002';

async function probe(label, url, path = '') {
  const target = `${url.replace(/\/$/, '')}${path}`;
  try {
    const res = await fetch(target, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      console.error(`✗ ${label} — HTTP ${res.status} (${target})`);
      return false;
    }
    console.log(`✓ ${label} — ${target}`);
    return true;
  } catch (err) {
    console.error(`✗ ${label} — ${err instanceof Error ? err.message : String(err)}`);
    return false;
  }
}

console.log('EPIS2 ai:smoke — Ollama + local-ai\n');

const ollamaOk = await probe('Ollama', OLLAMA_URL, '/api/tags');
const localAiOk = await probe('local-ai health', LOCAL_AI_URL, '/health');

if (!ollamaOk) {
  console.log('\nSugerencia: npm run stack:up');
}

if (!localAiOk) {
  console.log('\nSugerencia: npm run dev:ai (en otra terminal)');
}

process.exit(ollamaOk && localAiOk ? 0 : 1);
