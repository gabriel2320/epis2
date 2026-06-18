#!/usr/bin/env node
/** MF-CATALOG-00 — route map generado ↔ EPIS_CICA_SCREEN_REGISTRY. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseCicaScreenRegistry } from '../../tools/catalog/export-route-map.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const exportScript = join(root, 'tools/catalog/export-route-map.mjs');
const jsonPath = join(root, 'tools/catalog/route-map.generated.json');
const mdPath = join(root, 'docs/product/EPIS2_ROUTE_MAP.md');
const registryPath = join(root, 'packages/epis2-ui/src/cica/EPIS_CICA_SCREEN_REGISTRY.ts');

if (!existsSync(exportScript)) errors.push('falta tools/catalog/export-route-map.mjs');
if (!existsSync(jsonPath)) errors.push('falta tools/catalog/route-map.generated.json');
if (!existsSync(mdPath)) errors.push('falta docs/product/EPIS2_ROUTE_MAP.md');

const check = spawnSync(process.execPath, [exportScript, '--check'], {
  cwd: root,
  encoding: 'utf8',
});
if (check.status !== 0) {
  errors.push(`export-route-map --check falló: ${(check.stderr || check.stdout || '').trim()}`);
}

const registry = readFileSync(registryPath, 'utf8');
const parsed = parseCicaScreenRegistry(registry);
const artifact = JSON.parse(readFileSync(jsonPath, 'utf8'));

if (parsed.length !== artifact.screenCount) {
  errors.push(`screenCount JSON=${artifact.screenCount} registry=${parsed.length}`);
}

for (const stub of ['recent-patients', 'my-work', 'agenda']) {
  const row = artifact.screens.find((s) => s.screenId === stub);
  if (!row || row.status !== 'HIDE_STUB' || row.navVisible !== false) {
    errors.push(`${stub} debe ser HIDE_STUB navVisible=false`);
  }
}

const md = readFileSync(mdPath, 'utf8');
if (!md.includes('KEEP_FALLBACK') || !md.includes('/espacio/*')) {
  errors.push('ROUTE_MAP debe documentar KEEP_FALLBACK /espacio/*');
}

if (errors.length) {
  console.error('route-map-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`route-map-gate OK — screens=${artifact.screenCount}`);
