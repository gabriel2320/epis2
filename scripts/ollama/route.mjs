#!/usr/bin/env node
/** Muestra enrutado Ollama por función y estación. */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { formatRouteTable, resolveAllOllamaRoutes } from './model-router.mjs';
import { getOllamaEnv } from './native-client.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const jsonOut = process.argv.includes('--json');
const baseUrl = getOllamaEnv().baseUrl;

const routes = await resolveAllOllamaRoutes(baseUrl);

if (jsonOut) {
  mkdirSync(join(root, 'reports'), { recursive: true });
  const outPath = join(root, 'reports/ollama-model-routes.json');
  writeFileSync(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), routes }, null, 2), 'utf8');
  console.log(outPath);
  process.exit(0);
}

console.log('EPIS2 ollama:route\n');
console.log(formatRouteTable(routes));
console.log('\nOverrides (.env):');
console.log('  OLLAMA_ROUTE_MODE=auto|fixed');
console.log('  OLLAMA_ROUTE_DEV_PLAN=qwen2.5-coder:7b');
console.log('  OLLAMA_ROUTE_DEV_WRITE=deepseek-coder-v2:16b');
console.log('  EPIS2_WORKSTATION_TIER=minimal|standard|performance');
console.log('  EPIS2_WORKSTATION_VRAM_GB=12');

const missing = Object.values(routes).some((r) => r.missing);
process.exit(missing ? 1 : 0);
