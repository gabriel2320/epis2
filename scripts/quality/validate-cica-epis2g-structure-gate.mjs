#!/usr/bin/env node
/** CICA — mapa estructural epis2g alineado al registry canónico. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const registryPath = join(root, 'packages/epis2-ui/src/cica/EPIS_CICA_SCREEN_REGISTRY.ts');
const structurePath = join(root, 'packages/epis2-ui/src/cica/cicaEpis2gScreenStructure.ts');
const cicaIndexPath = join(root, 'packages/epis2-ui/src/cica/index.ts');

const registry = readFileSync(registryPath, 'utf8');
const structure = readFileSync(structurePath, 'utf8');
const cicaIndex = readFileSync(cicaIndexPath, 'utf8');

const registryIds = [...registry.matchAll(/id: '([^']+)'/g)].map((m) => m[1]);
const structureIds = [...structure.matchAll(/screenId: '([^']+)'/g)].map((m) => m[1]);

if (!structure.includes('EPIS2G_SCREEN_STRUCTURE')) {
  errors.push('cicaEpis2gScreenStructure.ts sin EPIS2G_SCREEN_STRUCTURE');
}

for (const token of [
  'CicaStructuredSection',
  'CicaSectionBlock',
  'CicaSystemWorkspaceHeader',
  'findEpis2gScreenStructure',
  'EPIS2G_SCREEN_STRUCTURE',
]) {
  if (!cicaIndex.includes(token)) {
    errors.push(`cica/index.ts falta export ${token}`);
  }
}

const registrySet = new Set(registryIds);
const structureSet = new Set(structureIds);

for (const id of registryIds) {
  if (!structureSet.has(id)) {
    errors.push(`EPIS2G_SCREEN_STRUCTURE falta screenId="${id}" del registry`);
  }
}

for (const id of structureIds) {
  if (!registrySet.has(id)) {
    errors.push(`EPIS2G_SCREEN_STRUCTURE screenId="${id}" no está en EPIS_CICA_SCREEN_REGISTRY`);
  }
}

const webCica = join(root, 'apps/web/src/cica');
for (const file of [
  'CicaPatientSearchPage.tsx',
  'CicaCensusPage.tsx',
  'CicaEpis2gScreens.tsx',
  'CicaPatientSectionPages.tsx',
]) {
  const src = readFileSync(join(webCica, file), 'utf8');
  if (!src.includes('CicaStructuredSection')) {
    errors.push(`${file} debe usar CicaStructuredSection (estructura epis2g)`);
  }
}

if (errors.length) {
  console.error('cica-epis2g-structure-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(
  `cica-epis2g-structure-gate OK — ${structureIds.length} pantallas alineadas registry ↔ epis2g`,
);
