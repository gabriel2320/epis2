#!/usr/bin/env node
/**
 * MF-IM-02 — Smoke embed nomic-embed-text vía local-ai /embed/document.
 *
 *   npm run ai:embed-smoke
 * Requiere: Ollama + nomic-embed-text + npm run dev:ai
 */
import { loadEnvFile } from './load-env.mjs';

loadEnvFile();

const RAG_EMBED_DIM = 384;

const LOCAL_AI_URL = process.env.LOCAL_AI_BASE_URL ?? 'http://127.0.0.1:3002';
const LOCAL_AI_API_KEY = process.env.LOCAL_AI_API_KEY;

async function main() {
  const headers = { 'Content-Type': 'application/json' };
  if (LOCAL_AI_API_KEY) {
    headers['x-local-ai-key'] = LOCAL_AI_API_KEY;
  }

  const res = await fetch(`${LOCAL_AI_URL.replace(/\/$/, '')}/embed/document`, {
    method: 'POST',
    headers,
    signal: AbortSignal.timeout(20_000),
    body: JSON.stringify({
      text: 'hemoglobina glicosilada control diabetes demo sintético',
      model: 'nomic-embed-text',
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`ai:embed-smoke FAILED — HTTP ${res.status}: ${text.slice(0, 300)}`);
    console.log('\nSugerencia: npm run stack:dev && npm run dev:ai');
    process.exit(1);
  }

  const body = await res.json();
  if (body.status !== 'success' || !Array.isArray(body.embedding)) {
    console.error('ai:embed-smoke FAILED — respuesta inválida:', body);
    process.exit(1);
  }

  if (body.embedding.length !== RAG_EMBED_DIM) {
    console.error(
      `ai:embed-smoke FAILED — dim ${body.embedding.length}, esperado ${RAG_EMBED_DIM}`,
    );
    process.exit(1);
  }

  console.log(
    `ai:embed-smoke OK — ${body.model} · ${body.embedding.length}d · ${body.latencyMs}ms`,
  );
}

main().catch((err) => {
  console.error('ai:embed-smoke FAILED:', err instanceof Error ? err.message : String(err));
  console.log('\nSugerencia: npm run stack:dev && npm run dev:ai');
  process.exit(1);
});
