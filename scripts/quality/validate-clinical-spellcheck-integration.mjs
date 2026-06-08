#!/usr/bin/env node
/** MF-CLINICAL-TEXTBOX-TOOLS — integración opcional LanguageTool self-hosted. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

function loadEnvUrl() {
  const fromEnv = process.env.LANGUAGETOOL_BASE_URL?.replace(/\/$/, '');
  if (fromEnv) return fromEnv;
  try {
    const example = readFileSync(join(root, '.env.example'), 'utf8');
    const match = example.match(/^LANGUAGETOOL_BASE_URL=(.+)$/m);
    if (match?.[1] && !match[1].startsWith('#')) return match[1].trim().replace(/\/$/, '');
  } catch {
    /* optional */
  }
  return 'http://127.0.0.1:8010';
}

const baseUrl = loadEnvUrl();
const checkUrl = `${baseUrl}/v2/check`;

async function main() {
  let res;
  try {
    res = await fetch(checkUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        text: 'El pacinete estable',
        language: 'es',
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (error) {
    console.log(
      `clinical-spellcheck-integration SKIP — LanguageTool no alcanzable en ${baseUrl} (${error instanceof Error ? error.message : error})`,
    );
    console.log('Levantar: docker compose --profile languagetool up -d languagetool');
    process.exit(0);
  }

  if (!res.ok) {
    console.error(`clinical-spellcheck-integration FAILED — LanguageTool ${res.status}`);
    process.exit(1);
  }

  const data = await res.json();
  if (!data || typeof data !== 'object' || !Array.isArray(data.matches)) {
    console.error('clinical-spellcheck-integration FAILED — respuesta LT inválida');
    process.exit(1);
  }

  console.log(`clinical-spellcheck-integration OK — ${data.matches.length} match(es) desde ${baseUrl}`);
}

void main();
