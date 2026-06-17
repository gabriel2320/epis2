#!/usr/bin/env node
/** MF-CON-03 phase 3 — gates PROG-AESTHETIC-RESET en catálogo activo. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AESTHETIC_CATALOG_LEGACY_ALIASES,
  KEEP_ACTIVE,
  PROMOTE_AESTHETIC_TO_ACTIVE,
  PROMOTE_TO_ACTIVE,
  loadManifestWired,
} from '../../tools/gates/gate-classify.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const catalog = JSON.parse(readFileSync(join(root, 'tools/gates/catalog-full.json'), 'utf8'));
const active = catalog.gates ?? {};
const archived = catalog.archived ?? {};

if (catalog.prunePhase !== '3') {
  errors.push('catalog-full.json prunePhase !== 3 — ejecutar apply-archive-promote-aesthetic.mjs');
}

const activeCount = Object.keys(active).length;
const archivedCount = Object.keys(archived).length;
const wired = loadManifestWired();

if (activeCount > 58) {
  errors.push(`gates activos=${activeCount} (esperado <=58 post aesthetic promote)`);
}
if (activeCount < 48) {
  errors.push(`gates activos=${activeCount} (esperado >=48 post aesthetic promote)`);
}

for (const gate of PROMOTE_AESTHETIC_TO_ACTIVE) {
  if (!active[gate]) errors.push(`activo aesthetic faltante: ${gate}`);
  if (archived[gate]) errors.push(`${gate} no debe estar en archived`);
}

for (const legacy of Object.keys(AESTHETIC_CATALOG_LEGACY_ALIASES)) {
  if (active[legacy]) errors.push(`alias legacy activo: ${legacy}`);
}

for (const gate of PROMOTE_TO_ACTIVE) {
  if (!active[gate]) errors.push(`activo gobernanza faltante: ${gate}`);
}

for (const gate of PROMOTE_AESTHETIC_TO_ACTIVE) {
  if (!KEEP_ACTIVE.has(gate)) errors.push(`${gate} debe estar en KEEP_ACTIVE`);
}

const stray = Object.keys(active).filter((g) => !wired.has(g) && !KEEP_ACTIVE.has(g));
if (stray.length) {
  errors.push(`catalog-only sin archivar (${stray.length}): ${stray.slice(0, 5).join(', ')}…`);
}

if (!existsSync(join(root, 'tools/gates/apply-archive-promote-aesthetic.mjs'))) {
  errors.push('falta apply-archive-promote-aesthetic.mjs');
}

const phase1 = readFileSync(join(root, 'tools/gates/apply-archive-prune-phase1.mjs'), 'utf8');
if (phase1.includes('quality:aesthetic-reset-close-gate') && phase1.includes('DEFER_CATALOG = [')) {
  const deferBlock = phase1.match(/DEFER_CATALOG = \[([\s\S]*?)\];/);
  if (deferBlock && deferBlock[1].trim().length > 0) {
    errors.push('apply-archive-prune-phase1.mjs aún lista gates en DEFER_CATALOG');
  }
}

if (errors.length) {
  console.error(
    'gates-promote-aesthetic-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log(
  `gates-promote-aesthetic-gate OK — active=${activeCount} archived=${archivedCount} aesthetic=${PROMOTE_AESTHETIC_TO_ACTIVE.length} wired=${wired.size}`,
);
