#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const switcher = join(root, 'apps/web/src/components/modes/EpisModeSwitcher.tsx');
if (!existsSync(switcher)) errors.push('Falta EpisModeSwitcher.tsx');

const src = readFileSync(switcher, 'utf8');
if (!src.includes('EPIS_MODES')) errors.push('Switcher debe usar EPIS_MODES (≤3)');
if (!src.includes('`${testId}-${mode}`') && !src.includes('epis2-mode-switcher-command')) {
  errors.push('Faltan testids por modo');
}

for (const file of [
  'apps/web/src/layouts/ClinicalGlobalTopBar.tsx',
  'apps/web/src/components/classic-md3/EpisClassicMd3TopAppBar.tsx',
  'apps/web/src/components/dashboard-md3/EpisDashboardMd3TopBar.tsx',
]) {
  const bar = readFileSync(join(root, file), 'utf8');
  if (!bar.includes('EpisModeSwitcher')) errors.push(`${file} debe incluir EpisModeSwitcher`);
}

if (errors.length) {
  console.error('mode-switcher-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('mode-switcher-gate OK');
