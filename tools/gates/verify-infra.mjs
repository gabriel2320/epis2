#!/usr/bin/env node
/** Verifica artefactos PROG-CONSOLIDATE Fase 0–2. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'tools/legacy-scripts/package-before-consolidation.json',
  'tools/gates/run-gate.mjs',
  'tools/gates/run-legacy.mjs',
  'tools/gates/required.json',
  'tools/gates/nightly.json',
  'tools/gates/experimental.json',
  'tools/gates/catalog.json',
  'tools/gates/catalog-full.json',
  'tools/scripts/classify.mjs',
  'docs/MAINTENANCE_PACKAGE_SCRIPTS.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
for (const script of [
  'quality:required',
  'quality:nightly',
  'quality:gate',
  'tool:gates:sync-catalog',
  'tool:scripts:classify',
  'tool:gates:apply-phase2',
  'tool:workspaces:apply-phase3',
]) {
  if (!pkg.scripts?.[script]) errors.push(`package.json sin ${script}`);
}

const qualityCount = Object.keys(pkg.scripts ?? {}).filter((k) => k.startsWith('quality:')).length;
if (qualityCount > 40) {
  errors.push(`quality:* en root aún alto (${qualityCount}); objetivo Fase 2 < 40`);
}

const catalog = JSON.parse(readFileSync(join(root, 'tools/gates/catalog-full.json'), 'utf8'));
if (Object.keys(catalog.gates ?? {}).length < 200) {
  errors.push('catalog-full.json demasiado pequeño');
}

if (errors.length) {
  console.error('consolidation-infra FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

const apiPkg = JSON.parse(readFileSync(join(root, 'apps/api/package.json'), 'utf8'));
const webPkg = JSON.parse(readFileSync(join(root, 'apps/web/package.json'), 'utf8'));
for (const script of ['db:migrate', 'db:validate']) {
  if (!apiPkg.scripts?.[script]) errors.push(`@epis2/api sin ${script}`);
}
if (!webPkg.scripts?.['test:e2e']) errors.push('@epis2/web sin test:e2e');
if (!existsSync(join(root, 'tools/scripts/run-e2e.mjs'))) {
  errors.push('Falta tools/scripts/run-e2e.mjs');
}

console.log(`consolidation-infra OK — Fase 0–3 gates (${qualityCount} quality:* en root)`);
