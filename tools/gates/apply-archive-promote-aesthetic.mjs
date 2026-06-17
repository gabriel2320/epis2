#!/usr/bin/env node
/**
 * PROG-AESTHETIC-RESET — promover gates MF-AEST/CICA-L del DEFER al catálogo activo.
 *   node tools/gates/apply-archive-promote-aesthetic.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AESTHETIC_CATALOG_LEGACY_ALIASES,
  PROMOTE_AESTHETIC_TO_ACTIVE,
  PROMOTE_TO_ACTIVE,
  gateToFileEntry,
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

const catalogPath = join(gatesDir, 'catalog-full.json');
const catalog = loadCatalog(catalogPath);

const active = { ...(catalog.gates ?? {}) };
const archived = { ...(catalog.archived ?? {}) };

let promoted = 0;
let aliasesRemoved = 0;

for (const [legacy, canonical] of Object.entries(AESTHETIC_CATALOG_LEGACY_ALIASES)) {
  if (active[legacy]) {
    delete active[legacy];
    aliasesRemoved++;
  }
  delete archived[legacy];
  delete active[canonical];
  delete archived[canonical];
}

for (const gate of PROMOTE_AESTHETIC_TO_ACTIVE) {
  const entry = gateToFileEntry(gate);
  if (!existsSync(join(root, entry.path))) {
    console.warn(`skip ${gate} — missing ${entry.path}`);
    continue;
  }
  active[gate] = entry;
  delete archived[gate];
  promoted++;
}

for (const gate of PROMOTE_TO_ACTIVE) {
  const entry = gateToFileEntry(gate);
  if (!existsSync(join(root, entry.path))) continue;
  if (!active[gate]) active[gate] = entry;
  delete archived[gate];
}

catalog.gates = active;
catalog.archived = archived;
catalog.prunePhase = '3';
catalog.source = 'catalog-full+aesthetic-promote';
catalog.aestheticPromotedAt = new Date().toISOString().slice(0, 10);

writeCatalog(catalogPath, catalog);

const slimPath = join(gatesDir, 'catalog.json');
if (existsSync(slimPath)) {
  const slim = loadCatalog(slimPath);
  slim.gates = { ...active };
  slim.archived = { ...archived };
  slim.prunePhase = '3';
  slim.aestheticPromotedAt = catalog.aestheticPromotedAt;
  writeCatalog(slimPath, slim);
}

console.log(
  `apply-archive-promote-aesthetic OK — promoted=${promoted} aliasesRemoved=${aliasesRemoved} active=${Object.keys(active).length} archived=${Object.keys(archived).length}`,
);
