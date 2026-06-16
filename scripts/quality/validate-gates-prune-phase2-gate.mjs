#!/usr/bin/env node
/** MF-CON-03 phase 2 — catálogo activo mínimo; resto en archived. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { KEEP_ACTIVE, PROMOTE_TO_ACTIVE, loadManifestWired } from '../../tools/gates/gate-classify.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const catalog = JSON.parse(readFileSync(join(root, 'tools/gates/catalog-full.json'), 'utf8'));
const active = catalog.gates ?? {};
const archived = catalog.archived ?? {};

if (catalog.prunePhase !== '2' && catalog.prunePhase !== '3') {
  errors.push(
    'catalog-full.json prunePhase !== 2|3 — ejecutar apply-archive-prune-phase2.mjs o promote-aesthetic',
  );
}

const activeCount = Object.keys(active).length;
const archivedCount = Object.keys(archived).length;
const wired = loadManifestWired();

const activeMax = catalog.prunePhase === '3' ? 58 : 45;
const activeMin = catalog.prunePhase === '3' ? 48 : 30;

if (activeCount > activeMax) {
  errors.push(`gates activos=${activeCount} (esperado <=${activeMax} post phase${catalog.prunePhase})`);
}
if (activeCount < activeMin) {
  errors.push(`gates activos=${activeCount} (esperado >=${activeMin} post phase${catalog.prunePhase})`);
}
if (archivedCount < 230) {
  errors.push(`gates archived=${archivedCount} (esperado >=230 post phase2)`);
}

for (const gate of PROMOTE_TO_ACTIVE) {
  if (!active[gate]) errors.push(`activo faltante: ${gate}`);
}

for (const gate of ['quality:tramos-hygiene-gate', 'quality:registry-gate', 'quality:ux-g02']) {
  if (!active[gate]) errors.push(`gobernanza activa faltante: ${gate}`);
}

const sampleArchived = [
  'quality:tramo-a-closure-gate',
  'quality:di-signoff-gate',
  'quality:week2-gate',
  'quality:paper-mode-signoff-gate',
];
for (const gate of sampleArchived) {
  if (!archived[gate]) errors.push(`archived faltante muestra: ${gate}`);
  if (active[gate]) errors.push(`${gate} no debe estar en activos`);
}

const stray = Object.keys(active).filter((g) => !wired.has(g) && !KEEP_ACTIVE.has(g));
if (stray.length) {
  errors.push(`catalog-only sin archivar (${stray.length}): ${stray.slice(0, 5).join(', ')}…`);
}

if (!existsSync(join(root, 'tools/gates/apply-archive-prune-phase2.mjs'))) {
  errors.push('falta apply-archive-prune-phase2.mjs');
}

if (errors.length) {
  console.error('gates-prune-phase2-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(
  `gates-prune-phase2-gate OK — active=${activeCount} archived=${archivedCount} wired=${wired.size}`,
);
