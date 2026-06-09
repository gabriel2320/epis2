#!/usr/bin/env node
/** MF-THREE-MODES — login siempre abre /comando. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const loginPage = readFileSync(join(root, 'apps/web/src/pages/LoginPage.tsx'), 'utf8');
const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
const guards = readFileSync(join(root, 'apps/web/src/modes/episModeGuards.ts'), 'utf8');

if (!loginPage.includes("to: '/comando'")) errors.push('LoginPage debe redirigir a /comando');
if (!router.includes("throw redirect({ to: '/comando' })")) errors.push('Router login autenticado → /comando');
if (!guards.includes("return 'command'")) errors.push('getDefaultModeAfterLogin debe devolver command');

if (errors.length) {
  console.error('login-command-home-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('login-command-home-gate OK');
