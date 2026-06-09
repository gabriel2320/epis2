#!/usr/bin/env node
/**
 * Instala hook pre-push local (no commiteado en .git/hooks).
 *
 *   npm run dev:install-hooks
 *   npm run dev:install-hooks -- --uninstall
 */
import { chmodSync, existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const hooksDir = join(root, '.git/hooks');
const hookPath = join(hooksDir, 'pre-push');
const uninstall = process.argv.includes('--uninstall');

const hookBody = `#!/bin/sh
# EPIS2 pre-push — generado por npm run dev:install-hooks
node "${join(root, 'scripts/dev/git-hooks/pre-push.mjs').replace(/\\/g, '/')}"
`;

if (uninstall) {
  if (existsSync(hookPath)) {
    const current = readFileSync(hookPath, 'utf8');
    if (current.includes('EPIS2 pre-push')) {
      unlinkSync(hookPath);
      console.log('✓ pre-push EPIS2 desinstalado');
    } else {
      console.warn('pre-push existe pero no es de EPIS2 — no se tocó');
    }
  } else {
    console.log('(i) No hay pre-push instalado');
  }
  process.exit(0);
}

if (!existsSync(join(root, '.git'))) {
  console.error('No es un repositorio git');
  process.exit(1);
}

mkdirSync(hooksDir, { recursive: true });
writeFileSync(hookPath, hookBody, 'utf8');
try {
  chmodSync(hookPath, 0o755);
} catch {
  // Windows: chmod opcional
}

console.log('✓ pre-push instalado → npm run check antes de cada push');
console.log('  Omitir emergencia: EPIS2_SKIP_PREPUSH=1 git push');
console.log('  Desinstalar: npm run dev:install-hooks -- --uninstall');
