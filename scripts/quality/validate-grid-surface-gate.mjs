#!/usr/bin/env node
/** MF-RAD-M3-A — superficies Grid migradas. */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const resultsPage = join(root, 'apps/web/src/pages/ResultsInboxPage.tsx');
if (!existsSync(resultsPage)) errors.push('Falta ResultsInboxPage.tsx');
else {
  const src = readFileSync(resultsPage, 'utf8');
  if (!src.includes('EpisRadGridSurface')) errors.push('ResultsInboxPage debe usar EpisRadGridSurface');
  if (!src.includes('ResultsInboxCriticalGrid')) errors.push('ResultsInboxPage sin grid críticos');
  if (src.includes('<ListItem')) errors.push('ResultsInboxPage aún usa listas card-like');
}

const registry = readFileSync(join(root, 'apps/web/src/design/radScreenRegistry.ts'), 'utf8');
const resultsEntry = registry.match(/id: 'results-inbox'[\s\S]*?migration: 'done'/);
if (!resultsEntry) errors.push('results-inbox debe estar migration done en registry');

const workEntry = registry.match(/id: 'dashboard-work'[\s\S]*?migration: 'done'/);
if (!workEntry) errors.push('dashboard-work debe estar migration done');

for (const id of ['dashboard-icu', 'dashboard-specialty', 'dashboard-patient', 'dashboard-quality']) {
  const entry = registry.match(new RegExp(`id: '${id}'[\\s\\S]*?migration: 'done'`));
  if (!entry) errors.push(`${id} debe estar migration done en registry`);
}

if (errors.length) {
  console.error('grid-surface-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('grid-surface-gate OK — superficies Grid MF-RAD-M3-A');
