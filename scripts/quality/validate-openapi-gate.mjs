#!/usr/bin/env node
/** MF-NORM-301 — spec OpenAPI generada desde Zod + validador swagger-parser. */
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

const test = spawnSync('npx', ['vitest', 'run', 'apps/api/src/openapi/document.test.ts'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});
if (test.status !== 0) {
  process.exit(test.status ?? 1);
}

const artifact = join(root, 'reports/openapi.json');
if (!existsSync(artifact)) {
  console.error('openapi-gate: falta reports/openapi.json (artefacto CI)');
  process.exit(1);
}

console.log('openapi-gate OK — spec válida en reports/openapi.json');
