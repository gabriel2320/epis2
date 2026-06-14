#!/usr/bin/env node
/** Regenera tools/gates/catalog.json — merge catalog-full + scripts/quality/*.mjs. */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import {
  buildCatalogFromPackage,
  gatesDirFrom,
  loadCatalogFile,
  mergeCatalog,
  repoRootFromGatesDir,
  writeCatalog,
} from './lib-catalog.mjs';

const gatesDir = gatesDirFrom(import.meta.url);
const root = repoRootFromGatesDir(gatesDir);
const snapshotPath = join(root, 'tools/legacy-scripts/package-before-consolidation.json');

let gates = {};
const existing = loadCatalogFile(gatesDir, true);
if (existing) {
  gates = { ...existing.data.gates };
} else if (existsSync(snapshotPath)) {
  const snap = JSON.parse(readFileSync(snapshotPath, 'utf8'));
  gates = buildCatalogFromPackage(snap);
}

const qualityDir = join(root, 'scripts/quality');
for (const file of readdirSync(qualityDir)) {
  if (!file.endsWith('.mjs')) continue;
  const base = file.replace(/\.mjs$/, '');
  let gateName = null;
  if (base.startsWith('validate-') && base.endsWith('-gate')) {
    gateName = `quality:${base.slice('validate-'.length)}`;
  } else if (base.endsWith('-gate')) {
    gateName = `quality:${base}`;
  }
  if (gateName && !gates[gateName]) {
    gates[gateName] = { type: 'file', path: `scripts/quality/${file}` };
  }
}

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
gates = mergeCatalog({ gates }, buildCatalogFromPackage(pkg));

writeCatalog(gatesDir, gates, existing ? 'catalog-full+fs' : 'package-before-consolidation+fs');
console.log(`catalog.json OK — ${Object.keys(gates).length} entradas quality:*`);
