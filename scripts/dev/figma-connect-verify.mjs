#!/usr/bin/env node
/**
 * Verifica preparación Code Connect + Figma MCP (sin secretos en stdout).
 *
 *   npm run figma:verify
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const configPath = join(root, 'figma.config.json');
const docPath = join(root, 'docs/dev/EPIS2_FIGMA_CODE_CONNECT.md');

const token = process.env.FIGMA_ACCESS_TOKEN?.trim();
const hasToken = Boolean(token && token.length > 10);

let remote = '';
try {
  remote = execSync('git remote get-url origin', { cwd: root, encoding: 'utf8' }).trim();
} catch {
  remote = '(sin origin)';
}

console.log('EPIS2 Figma Code Connect\n');

console.log(
  `  figma.config.json    ${existsSync(configPath) ? 'OK' : 'MISSING — crear en raíz del repo'}`,
);
console.log(
  `  guía setup           ${existsSync(docPath) ? 'OK (docs/dev/EPIS2_FIGMA_CODE_CONNECT.md)' : 'MISSING'}`,
);
console.log(`  git remote origin    ${remote.includes('epis2') ? 'OK' : remote}`);

const figmaTsCount = (() => {
  try {
    const out = execSync('git ls-files "**/*.figma.ts"', {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    return out ? out.split('\n').length : 0;
  } catch {
    return 0;
  }
})();
console.log(
  `  archivos .figma.ts   ${figmaTsCount > 0 ? `${figmaTsCount} mapeo(s)` : 'ninguno aún (normal al inicio)'}`,
);

console.log(
  `  FIGMA_ACCESS_TOKEN   ${hasToken ? 'OK (definido en .env)' : 'MISSING — token Figma con scopes Code Connect + File content'}`,
);

console.log('\nPasos que debes completar en Figma (una vez):');
console.log('  1. Cursor → Settings → MCP → Figma → Connect (OAuth)');
console.log('  2. Figma → biblioteca MD3 → Dev Mode → Library → Connect components to code');
console.log('  3. Code Connect ⚙ → Connect to GitHub → repo gabriel2320/epis2');
console.log('  4. Directorios: packages/epis2-ui/src · apps/web/src/components');
console.log('\nPublicar mapeos CLI: npm run figma:connect:publish');
console.log('Doc: docs/dev/EPIS2_FIGMA_CODE_CONNECT.md\n');

if (!existsSync(configPath)) {
  process.exitCode = 1;
}
