#!/usr/bin/env node
/**
 * MF-PONY-GATE-01 — retag gates archived → PROG-PONYTAIL-TRIM.
 *   node tools/gates/apply-archive-ponytail-gate.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PONYTAIL_ARCHIVED_GATES, PONYTAIL_REMOVED_GATES } from './ponytail-gate-list.mjs';

const gatesDir = dirname(fileURLToPath(import.meta.url));
const archivedAt = '2026-06-18';

function loadCatalog(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeCatalog(path, data) {
  data.generatedAt = new Date().toISOString();
  data.note = 'Regenerar inventario: node tools/gates/inventory-orphans.mjs';
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

const catalogPath = join(gatesDir, 'catalog-full.json');
const catalog = loadCatalog(catalogPath);
const active = { ...(catalog.gates ?? {}) };
const archived = { ...(catalog.archived ?? {}) };

let retagged = 0;
let moved = 0;
let removed = 0;

for (const gate of PONYTAIL_ARCHIVED_GATES) {
  const entry = archived[gate] ?? active[gate];
  if (!entry) continue;
  archived[gate] = {
    ...entry,
    archivedProgram: 'PROG-PONYTAIL-TRIM',
    archivedAt,
  };
  if (active[gate]) {
    delete active[gate];
    moved++;
  }
  retagged++;
}

for (const gate of PONYTAIL_REMOVED_GATES) {
  if (archived[gate] || active[gate]) {
    delete archived[gate];
    delete active[gate];
    removed++;
  }
}

catalog.gates = active;
catalog.archived = archived;
catalog.ponytailGateArchiveAt = archivedAt;
writeCatalog(catalogPath, catalog);

const slimPath = join(gatesDir, 'catalog.json');
if (existsSync(slimPath)) {
  const slim = loadCatalog(slimPath);
  slim.gates = { ...active };
  slim.archived = { ...archived };
  slim.ponytailGateArchiveAt = archivedAt;
  writeCatalog(slimPath, slim);
}

console.log(
  `apply-archive-ponytail-gate OK — retagged=${retagged} moved=${moved} removed=${removed} active=${Object.keys(active).length} archived=${Object.keys(archived).length}`,
);
