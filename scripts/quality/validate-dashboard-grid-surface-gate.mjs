#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const gridSrc = readFileSync(
  join(root, 'apps/web/src/components/dashboard-md3/EpisDashboardMd3MainGrid.tsx'),
  'utf8',
);
const registrySrc = readFileSync(join(root, 'apps/web/src/design/radScreenRegistry.ts'), 'utf8');
const errors = [];
if (!gridSrc.includes('epis2-dashboard-md3-main-grid')) errors.push('Falta main grid testid');
if (!registrySrc.includes('mode=dashboard') && !registrySrc.includes("mode: 'dashboard'")) {
  errors.push('radScreenRegistry debe declarar mode dashboard');
}
if (errors.length) {
  console.error('dashboard-grid-surface-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('dashboard-grid-surface-gate OK');
