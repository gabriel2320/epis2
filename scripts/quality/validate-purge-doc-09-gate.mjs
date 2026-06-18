#!/usr/bin/env node
/** MF-PURGE-DOC-09 — lote 8 archivado + reports/ raíz <80. */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const archiveDir = join(root, 'reports/archive/2026-06');
const manifestPath = join(archiveDir, 'lote8-manifest.json');
const reportsDir = join(root, 'reports');

if (!existsSync(manifestPath)) {
  errors.push(
    'falta reports/archive/2026-06/lote8-manifest.json — ejecutar archive-reports-lote8.mjs',
  );
} else {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.moved.length < 10) {
    errors.push(`lote8 moved=${manifest.moved.length} (esperado ≥10)`);
  }
  for (const file of manifest.moved) {
    if (existsSync(join(reportsDir, file))) {
      errors.push(`${file} aún en reports/ raíz`);
    }
    if (!existsSync(join(archiveDir, file))) {
      errors.push(`${file} falta en archive/2026-06`);
    }
  }
}

const keepInRoot = [
  'epis2-mf-brujula-00-close.md',
  'epis2-mf-catalog-00-close.md',
  'epis2-mf-catalog-01-close.md',
  'epis2-mf-catalog-gate-01-close.md',
  'epis2-mf-pony-gate-01-close.md',
  'knip-audit-pony-2026-06-18.md',
  'epis2-prog-product-map-close.md',
  'dev-agent-brief.md',
];
for (const file of keepInRoot) {
  if (!existsSync(join(reportsDir, file))) {
    errors.push(`debe permanecer en raíz: ${file}`);
  }
}

const rootMdCount = readdirSync(reportsDir).filter((f) => f.endsWith('.md')).length;
if (rootMdCount >= 80) {
  errors.push(`reports/ raíz tiene ${rootMdCount} .md (meta <80)`);
}

const inventory = readFileSync(join(root, 'docs/MODULE_INVENTORY.md'), 'utf8');
if (inventory.includes('reports/epis2-mf-pony-01-close.md')) {
  errors.push('MODULE_INVENTORY aún apunta pony MF closes a reports/ raíz');
}

if (errors.length) {
  console.error('purge-doc-09-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`purge-doc-09-gate OK — lote 8 · reports/ raíz=${rootMdCount} .md`);
