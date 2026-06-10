#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const shell = readFileSync(
  join(root, 'apps/web/src/components/dashboard-md3/EpisDashboardMd3Shell.tsx'),
  'utf8',
);
const topBar = readFileSync(
  join(root, 'apps/web/src/components/dashboard-md3/EpisDashboardMd3TopBar.tsx'),
  'utf8',
);
const errors = [];
if (!shell.includes('kpiStrip') || !shell.includes('mainGrid')) {
  errors.push('Dashboard debe ser sala de control (KPI + grid)');
}
if (!topBar.includes('onBackToCommand')) errors.push('Dashboard debe volver a comando');
if (/firmar|aprobar/.test(topBar.replace(/data-epis-forbidden-actions[^"]*"[^"]*"/, ''))) {
  errors.push('Dashboard top bar no debe firmar/aprobar');
}

if (errors.length) {
  console.error(
    'dashboard-mode-isolation-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}
console.log('dashboard-mode-isolation-gate OK');
