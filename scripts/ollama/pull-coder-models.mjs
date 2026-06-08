#!/usr/bin/env node
/**
 * Descarga modelos Ollama cuantizados especializados en código (dev-agent).
 * Clínica producto sigue en OLLAMA_MODEL (qwen3:8b).
 *
 *   npm run ai:pull-coder-models
 *   npm run ai:pull-coder-models -- --only qwen2.5-coder:7b
 */
import { spawnSync } from 'node:child_process';
import { loadEnvFile } from '../load-env.mjs';
import { probeOllamaNative, isModelInstalled } from './native-client.mjs';

loadEnvFile();

/** Tags Ollama (Q4_K_M u equivalente en registry). Orden: ligero → fuerte. */
export const CODER_MODELS = [
  {
    tag: 'qwen2.5-coder:7b',
    note: 'Rápido · planes JSON + parches L0 · ~4.7 GB',
  },
  {
    tag: 'qwen2.5-coder:14b',
    note: 'Balance calidad/VRAM · recomendado dev · ~9 GB',
  },
  {
    tag: 'deepseek-coder-v2:16b',
    note: 'Fuerte en TypeScript/React · ~9 GB',
  },
  {
    tag: 'deepseek-coder:6.7b',
    note: 'Fallback ligero · ~4 GB',
  },
];

const args = process.argv.slice(2);
const onlyIdx = args.indexOf('--only');
const onlyTag = onlyIdx >= 0 ? args[onlyIdx + 1] : null;
const list = onlyTag ? CODER_MODELS.filter((m) => m.tag === onlyTag) : CODER_MODELS;

if (onlyTag && list.length === 0) {
  console.error(`Tag desconocido: ${onlyTag}`);
  console.error(`Válidos: ${CODER_MODELS.map((m) => m.tag).join(', ')}`);
  process.exit(1);
}

const baseUrl = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
const probe = await probeOllamaNative(baseUrl);
if (!probe.ok) {
  console.error(`Ollama no responde en ${baseUrl}`);
  console.error('  npm run ai:enable');
  process.exit(1);
}

console.log('EPIS2 ai:pull-coder-models\n');
console.log(`  Ollama: ${baseUrl}`);
console.log(`  Clínica (sin cambiar): ${process.env.OLLAMA_MODEL ?? 'qwen3:8b'}`);
console.log(`  Dev sugerido (.env):   ${process.env.OLLAMA_DEV_MODEL ?? 'qwen2.5-coder:14b'}\n`);

let failed = 0;
for (const { tag, note } of list) {
  if (isModelInstalled(probe.models, tag)) {
    console.log(`✓ ${tag} — ya instalado (${note})`);
    continue;
  }
  console.log(`▶ ollama pull ${tag}`);
  console.log(`  ${note}\n`);
  let ok = false;
  for (let attempt = 1; attempt <= 2 && !ok; attempt += 1) {
    if (attempt > 1) console.log(`  Reintento ${attempt}/2…\n`);
    const r = spawnSync('ollama', ['pull', tag], { stdio: 'inherit', shell: true });
    ok = r.status === 0;
  }
  if (!ok) {
    console.error(`✗ falló pull ${tag}\n`);
    failed += 1;
  } else {
    console.log(`✓ ${tag} OK\n`);
  }
}

if (failed) {
  console.error(`pull-coder-models: ${failed} modelo(s) fallaron`);
  process.exit(1);
}

console.log('pull-coder-models OK');
console.log('\nEnrutado automático: npm run ollama:route');
console.log('  OLLAMA_ROUTE_MODE=auto (default)');
