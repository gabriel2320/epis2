#!/usr/bin/env node
/**
 * Git pre-push — check rápido antes de publicar (opcional, local).
 * Instalar: npm run dev:install-hooks
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

if (process.env.EPIS2_SKIP_PREPUSH === '1') {
  console.warn('EPIS2 pre-push: omitido (EPIS2_SKIP_PREPUSH=1)');
  process.exit(0);
}

console.log('EPIS2 pre-push: npm run check …');
const r = spawnSync('npm', ['run', 'check'], {
  cwd: root,
  stdio: 'inherit',
  shell: true,
});

if (r.status !== 0) {
  console.error('\n✗ pre-push bloqueado — fix check o EPIS2_SKIP_PREPUSH=1 (emergencia)');
  process.exit(r.status ?? 1);
}

console.log('✓ pre-push OK');
process.exit(0);
