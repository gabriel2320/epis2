#!/usr/bin/env node
/** MF-CON-03 phase 1 — catálogo activo podado; archived resuelve vía run-legacy. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PROMOTE_TO_ACTIVE } from '../../tools/gates/gate-classify.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const catalog = JSON.parse(readFileSync(join(root, 'tools/gates/catalog-full.json'), 'utf8'));
const active = catalog.gates ?? {};
const archived = catalog.archived ?? {};

if (!catalog.prunePhase) {
  errors.push('catalog-full.json sin prunePhase — ejecutar apply-archive-prune-phase1.mjs');
}

const activeCount = Object.keys(active).length;
const archivedCount = Object.keys(archived).length;

if (activeCount > 200) {
  errors.push(`gates activos=${activeCount} (esperado <=200 post phase1)`);
}
if (archivedCount < 80) {
  errors.push(`gates archived=${archivedCount} (esperado >=80 post phase1)`);
}

for (const gate of PROMOTE_TO_ACTIVE) {
  if (!active[gate]) errors.push(`activo faltante: ${gate}`);
}

const sampleArchived = [
  'quality:ola3-ficha-gate',
  'quality:tramo-b-reception-gate',
  'quality:cm-01-barra-gate',
  'quality:paper-planner-month-gate',
];
for (const gate of sampleArchived) {
  if (!archived[gate]) errors.push(`archived faltante muestra: ${gate}`);
  if (active[gate]) errors.push(`${gate} no debe estar en activos`);
}

const runLegacy = readFileSync(join(root, 'tools/gates/run-legacy.mjs'), 'utf8');
if (!runLegacy.includes('catalog.archived')) {
  errors.push('run-legacy.mjs debe resolver catalog.archived');
}

if (!existsSync(join(root, 'tools/gates/apply-archive-prune-phase1.mjs'))) {
  errors.push('falta apply-archive-prune-phase1.mjs');
}

if (errors.length) {
  console.error('gates-prune-phase1-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(
  `gates-prune-phase1-gate OK — active=${activeCount} archived=${archivedCount} (phase 1)`,
);
