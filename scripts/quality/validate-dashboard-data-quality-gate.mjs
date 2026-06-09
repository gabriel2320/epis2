#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const statusSrc = readFileSync(
  join(root, 'apps/web/src/components/dashboard-md3/EpisDashboardMd3StatusBar.tsx'),
  'utf8',
);
const scopeSrc = readFileSync(
  join(root, 'apps/web/src/components/dashboard-md3/EpisDashboardMd3ScopeBar.tsx'),
  'utf8',
);
const errors = [];
if (!statusSrc.includes('statusUpdated')) errors.push('Status bar debe mostrar actualización');
if (!scopeSrc.includes('epis2-dashboard-md3-scope-bar')) errors.push('Scope bar debe ser visible');
if (errors.length) {
  console.error('dashboard-data-quality-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('dashboard-data-quality-gate OK');
