#!/usr/bin/env node
/** Probe Ollama nativo — estado, modelos, enrutado por función. */
import { loadEnvFile } from '../load-env.mjs';
import { ensureOllamaReady, getOllamaStatus } from './native-client.mjs';
import { formatRouteTable, resolveAllOllamaRoutes } from './model-router.mjs';

loadEnvFile();

const status = await getOllamaStatus();
const routes = await resolveAllOllamaRoutes(status.baseUrl);

console.log('EPIS2 ollama:probe\n');
console.log(`  URL:    ${status.baseUrl}`);
console.log(`  Clínica: ${status.model} · ${status.modelReady ? '✓' : '✗'}`);
console.log(`  Up:     ${status.up ? '✓' : '✗'}`);

if (status.models?.length) {
  console.log(`  Tags:   ${status.models.slice(0, 8).join(', ')}${status.models.length > 8 ? '…' : ''}`);
}

console.log('\n' + formatRouteTable(routes));

if (!status.up || !status.modelReady) {
  const ready = await ensureOllamaReady();
  if (!ready.ready) {
    console.log(`\n  Hint: ${ready.hint}`);
  }
  process.exit(1);
}

console.log('\nollama:probe OK');
process.exit(0);