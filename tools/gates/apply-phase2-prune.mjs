#!/usr/bin/env node
/**
 * PROG-CONSOLIDATE Fase 2 — reduce quality:* en root; catálogo = SoT.
 *   npm run tool:gates:apply-phase2
 */
import { readFileSync, writeFileSync, copyFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const gatesDir = dirname(fileURLToPath(import.meta.url));
const pkgPath = join(root, 'package.json');
const catalogPath = join(gatesDir, 'catalog.json');
const catalogFullPath = join(gatesDir, 'catalog-full.json');

const KEEP_ROOT = new Set([
  'quality:fast',
  'quality:clinical',
  'quality:full',
  'quality:required',
  'quality:nightly',
  'quality:ui',
  'quality:ai',
]);

/** Gates referenciados por CI, manifiestos o registry-gate — mantener alias npm. */
const WIRED_SHIMS = new Set([
  'quality:ficha-first-gate',
  'quality:case-intel-closure-gate',
  'quality:openapi-gate',
  'quality:pm01',
  'quality:layers-integration-gate',
  'quality:ci-parity',
  'quality:golden-journey',
  'quality:dual-chart-gate',
  'quality:rapid-gate',
  'quality:strengthen-next',
  'quality:strengthen-close-gate',
  'quality:interop-chile-gate',
  'quality:cds-hooks-gate',
  'quality:registry-status',
  'quality:sh-03-degrade-gate',
  'quality:ai-client-gate',
  'quality:web-ai-boundary-gate',
  'quality:ui-simplify-gate',
  'quality:microphases',
  'quality:three-modes-gate',
  'quality:classic-md3-mode-gate',
  'quality:dashboard-md3-mode-gate',
  'quality:mode-transitions-gate',
  'quality:mode-guards-gate',
  'quality:mode-safety-gate',
]);

const ARCHIVE_RE =
  /^quality:(tramo|ola|week|te-|pa-|cm-|m3-|ficha-norm|dual-chart|classic-|dashboard-|paper-planner|three-modes|pm0)/;

function isArchive(name) {
  if (WIRED_SHIMS.has(name)) return false;
  return ARCHIVE_RE.test(name);
}

function thinShim(name) {
  return `node tools/gates/run-legacy.mjs ${name}`;
}

if (!existsSync(catalogPath)) {
  console.error('Falta tools/gates/catalog.json — ejecutar tool:gates:sync-catalog primero');
  process.exit(1);
}

if (!existsSync(catalogFullPath)) {
  copyFileSync(catalogPath, catalogFullPath);
  console.log('catalog-full.json creado desde catalog.json');
}

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const scripts = { ...(pkg.scripts ?? {}) };
let removed = 0;
let shimmed = 0;
let kept = 0;

for (const name of Object.keys(scripts)) {
  if (!name.startsWith('quality:')) continue;

  if (KEEP_ROOT.has(name)) {
    kept++;
    continue;
  }

  if (WIRED_SHIMS.has(name)) {
    if (scripts[name] !== thinShim(name)) {
      scripts[name] = thinShim(name);
      shimmed++;
    }
    continue;
  }

  if (isArchive(name)) {
    delete scripts[name];
    removed++;
    continue;
  }

  // MOVE_TO_TOOLS — quitar del root; invocar vía quality:gate
  delete scripts[name];
  removed++;
}

scripts['quality:gate'] = 'node tools/gates/run-legacy.mjs';

pkg.scripts = scripts;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`phase2-prune OK — kept ${kept} meta, shimmed ${shimmed}, removed ${removed}`);
console.log(
  `  quality:* restantes: ${Object.keys(scripts).filter((k) => k.startsWith('quality:')).length}`,
);
console.log('  Invocar catálogo: npm run quality:gate -- quality:<name>');
