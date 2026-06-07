#!/usr/bin/env node
/**
 * Smoke Semana 3 — catálogo visual dev + frontera assist (local-ai / API).
 * Uso: npm run ai:catalog-assist-smoke
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from './load-env.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const LOCAL_AI_URL = process.env.LOCAL_AI_BASE_URL ?? 'http://127.0.0.1:3002';
const API_URL = process.env.EPIS2_SMOKE_API_URL ?? `http://127.0.0.1:${process.env.API_PORT ?? 3001}`;
const errors = [];

const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
if (!router.includes("path: '/desarrollo/catalogo-visual'")) {
  errors.push('router sin /desarrollo/catalogo-visual');
}

const catalogEnv = readFileSync(join(root, 'apps/web/src/dev/visualThemeCatalogEnv.ts'), 'utf8');
if (!catalogEnv.includes('VITE_ENABLE_VISUAL_THEME_CATALOG')) {
  errors.push('visualThemeCatalogEnv sin flag VITE_ENABLE_VISUAL_THEME_CATALOG');
}

async function probe(label, url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) {
      errors.push(`${label} HTTP ${res.status}`);
      return;
    }
    console.log(`✓ ${label}`);
  } catch (err) {
    errors.push(`${label}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

console.log('EPIS2 ai:catalog-assist-smoke\n');

await probe('local-ai /capabilities', `${LOCAL_AI_URL.replace(/\/$/, '')}/capabilities`);

try {
  const res = await fetch(`${API_URL.replace(/\/$/, '')}/api/ai/status`, {
    signal: AbortSignal.timeout(8000),
  });
  if (res.status === 401) {
    console.log('✓ API /api/ai/status — requiere sesión (esperado sin cookie)');
  } else if (res.ok) {
    const body = await res.json();
    if (typeof body.available !== 'boolean') {
      errors.push('API /api/ai/status sin campo available');
    } else {
      console.log(`✓ API /api/ai/status — available=${body.available}`);
    }
  } else {
    errors.push(`API /api/ai/status HTTP ${res.status}`);
  }
} catch {
  console.log('(i) API no responde — omitido (levantar npm run dev:api para smoke completo)');
}

if (errors.length) {
  console.error('\nai:catalog-assist-smoke FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('\nai:catalog-assist-smoke OK');
