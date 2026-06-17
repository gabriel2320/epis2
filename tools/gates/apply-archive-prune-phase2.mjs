#!/usr/bin/env node
/**
 * PROG-CONSOLIDATE — poda phase 2: catalog-only → archived.
 *   node tools/gates/apply-archive-prune-phase2.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PROMOTE_TO_ACTIVE,
  gateArchivePhase2,
  gateToFileEntry,
  loadManifestWired,
} from './gate-classify.mjs';

const gatesDir = dirname(fileURLToPath(import.meta.url));
const root = join(gatesDir, '../..');

function loadCatalog(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeCatalog(path, data) {
  data.generatedAt = new Date().toISOString();
  data.note = 'Regenerar inventario: node tools/gates/inventory-orphans.mjs';
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n');
}

const wired = loadManifestWired();
const catalogPath = join(gatesDir, 'catalog-full.json');
const catalog = loadCatalog(catalogPath);

if (!catalog.prunePhase) {
  console.error('Ejecutar apply-archive-prune-phase1.mjs primero');
  process.exit(1);
}

const active = { ...(catalog.gates ?? {}) };
const archived = { ...(catalog.archived ?? {}) };

let moved = 0;
let promoted = 0;

for (const gate of PROMOTE_TO_ACTIVE) {
  const entry = gateToFileEntry(gate);
  if (!existsSync(join(root, entry.path))) continue;
  if (!active[gate]) {
    active[gate] = entry;
    promoted++;
  }
  delete archived[gate];
}

for (const gate of Object.keys({ ...active })) {
  const program = gateArchivePhase2(gate, wired);
  if (!program) continue;
  archived[gate] = { ...active[gate], archivedProgram: program, archivedAt: '2026-06-16' };
  delete active[gate];
  moved++;
}

catalog.gates = active;
catalog.archived = archived;
catalog.prunePhase = '2';
catalog.source = 'catalog-full+prune-phase2';

writeCatalog(catalogPath, catalog);

const slimPath = join(gatesDir, 'catalog.json');
if (existsSync(slimPath)) {
  const slim = loadCatalog(slimPath);
  slim.gates = { ...active };
  slim.archived = { ...archived };
  slim.prunePhase = '2';
  writeCatalog(slimPath, slim);
}

console.log(
  `apply-archive-prune-phase2 OK — moved=${moved} promoted=${promoted} active=${Object.keys(active).length} archived=${Object.keys(archived).length}`,
);
