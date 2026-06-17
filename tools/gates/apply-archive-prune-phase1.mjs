#!/usr/bin/env node
/**
 * PROG-CONSOLIDATE — poda phase 1: mover archive-candidates a catalog.archived.
 *   node tools/gates/apply-archive-prune-phase1.mjs
 * No borra scripts validate-*.mjs.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  PROMOTE_TO_ACTIVE,
  gateArchiveProgram,
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

const active = { ...(catalog.gates ?? {}) };
const archived = { ...(catalog.archived ?? {}) };

let moved = 0;
let promoted = 0;
let deferred = 0;

/** Promovidos — apply-archive-promote-aesthetic.mjs (PROG-AESTHETIC-RESET). */
const DEFER_CATALOG = [];

for (const gate of DEFER_CATALOG) {
  if (active[gate]) {
    delete active[gate];
    deferred++;
  }
  delete archived[gate];
}

for (const gate of PROMOTE_TO_ACTIVE) {
  const entry = gateToFileEntry(gate);
  if (!existsSync(join(root, entry.path))) continue;
  if (!active[gate]) {
    active[gate] = entry;
    promoted++;
  }
  delete archived[gate];
}

for (const gate of Object.keys(active)) {
  const program = gateArchiveProgram(gate, wired);
  if (!program) continue;
  archived[gate] = { ...active[gate], archivedProgram: program, archivedAt: '2026-06-16' };
  delete active[gate];
  moved++;
}

catalog.gates = active;
catalog.archived = archived;
catalog.prunePhase = '1';
catalog.source = 'catalog-full+prune-phase1';

writeCatalog(catalogPath, catalog);

const slimPath = join(gatesDir, 'catalog.json');
if (existsSync(slimPath)) {
  const slim = loadCatalog(slimPath);
  slim.gates = { ...active };
  slim.archived = { ...archived };
  slim.prunePhase = '1';
  writeCatalog(slimPath, slim);
}

console.log(
  `apply-archive-prune-phase1 OK — moved=${moved} promoted=${promoted} deferred=${deferred} active=${Object.keys(active).length} archived=${Object.keys(archived).length}`,
);
