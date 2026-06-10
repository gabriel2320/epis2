#!/usr/bin/env node
/** Ejecuta closure gates estáticos A–K (sin E2E ni servicios). */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const gates = 'ABCDEFGHIJK'
  .split('')
  .map((id) => `validate-tramo-${id.toLowerCase()}-closure-gate.mjs`);

console.log('EPIS2 run-tramos-ak-closure-gates\n');

for (const gate of gates) {
  const path = join(root, 'scripts/quality', gate);
  process.stdout.write(`▶ ${gate} `);
  const result = spawnSync(process.execPath, [path], { stdio: 'pipe', cwd: root });
  if (result.status !== 0) {
    console.log('FAIL');
    process.stderr.write(result.stderr?.toString() ?? '');
    process.exit(result.status ?? 1);
  }
  console.log('OK');
}

console.log('\nrun-tramos-ak-closure-gates OK — cadena A–K verificada');
