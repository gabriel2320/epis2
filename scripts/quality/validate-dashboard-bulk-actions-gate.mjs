#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const bulkSrc = readFileSync(
  join(root, 'apps/web/src/components/actions/EpisBulkActionMenu.tsx'),
  'utf8',
);
const gridSrc = readFileSync(
  join(root, 'apps/web/src/components/dashboard-md3/EpisDashboardMd3MainGrid.tsx'),
  'utf8',
);
const errors = [];
if (!bulkSrc.includes('EpisBulkActionMenu')) errors.push('EpisBulkActionMenu debe existir');
if (!gridSrc.includes('bulkActions')) errors.push('Main grid debe aceptar bulkActions slot');
if (errors.length) {
  console.error('dashboard-bulk-actions-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('dashboard-bulk-actions-gate OK');
