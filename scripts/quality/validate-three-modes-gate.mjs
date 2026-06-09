#!/usr/bin/env node
/** Tres modos canónicos + orquestación MF-THREE-MODES. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'apps/web/src/modes/episModes.ts',
  'apps/web/src/modes/episModeGuards.ts',
  'apps/web/src/modes/modeTransitions.ts',
  'apps/web/src/modes/EpisModeGuard.tsx',
  'apps/web/src/session/EpisSessionContext.tsx',
  'apps/web/src/components/modes/EpisModeSwitcher.tsx',
  'apps/web/src/components/command/EpisUniversalCommandBar.tsx',
];

for (const f of required) {
  if (!existsSync(join(root, f))) errors.push(`Falta ${f}`);
}

const routerSrc = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
const mainSrc = readFileSync(join(root, 'apps/web/src/main.tsx'), 'utf8');
if (!routerSrc.includes("path: '/comando'")) errors.push('/comando debe ser home');
if (!mainSrc.includes('EpisSessionProvider')) errors.push('main.tsx debe montar EpisSessionProvider');

if (errors.length) {
  console.error('three-modes-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

for (const gate of ['validate-login-command-home-gate.mjs', 'validate-mode-switcher-gate.mjs']) {
  const child = spawnSync(process.execPath, [join(root, 'scripts/quality', gate)], { stdio: 'inherit' });
  if (child.status !== 0) process.exit(child.status ?? 1);
}

console.log('three-modes-gate OK — command + classic + dashboard + orchestration');
