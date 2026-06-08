#!/usr/bin/env node
/** MF-UI-SIMPLIFY — acciones masivas solo con selección. */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const path = join(root, 'packages/clinical-productivity/src/components/ClinicalBulkActionMenu.tsx');
if (!existsSync(path)) errors.push('Falta ClinicalBulkActionMenu.tsx');

const src = readFileSync(path, 'utf8');
if (!src.includes('selectedCount <= 0')) errors.push('BulkActionMenu debe ocultarse sin selección');
if (!src.includes('requiresConfirmation') && !src.includes('destructive')) {
  errors.push('BulkActionMenu sin confirmación de acciones riesgosas');
}

if (errors.length) {
  console.error('bulk-actions-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('bulk-actions-gate OK — menú de selección múltiple seguro');
