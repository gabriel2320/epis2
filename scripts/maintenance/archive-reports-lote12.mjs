#!/usr/bin/env node
/**
 * MF-PURGE-DOC-12 — archiva MF individuales PROG-PRODUCT-MAP (lote 12).
 *   node scripts/maintenance/archive-reports-lote12.mjs [--dry-run]
 */
import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dryRun = process.argv.includes('--dry-run');
const archiveDir = join(root, 'reports/archive/2026-06');
const reportsDir = join(root, 'reports');

/** Hub único en raíz: epis2-prog-product-map-close.md */
const LOTE12_FILES = [
  'epis2-mf-brujula-00-close.md',
  'epis2-mf-catalog-00-close.md',
  'epis2-mf-catalog-01-close.md',
  'epis2-mf-catalog-gate-01-close.md',
  'epis2-mf-knip-05a-close.md',
  'epis2-mf-knip-05b-close.md',
  'epis2-mf-release-base-01-close.md',
  'epis2-mf-purge-doc-08-close.md',
  'knip-audit-product-map-baseline-2026-06-18.md',
  'knip-audit-product-map-lote1-2026-06-18.md',
];

if (!existsSync(archiveDir)) {
  mkdirSync(archiveDir, { recursive: true });
}

const manifest = {
  lote: 12,
  date: '2026-06-18',
  program: 'PROG-PURGE-CICA',
  mf: 'MF-PURGE-DOC-12',
  dryRun,
  moved: [],
  missing: [],
  skippedAlreadyInArchive: [],
};

for (const file of LOTE12_FILES) {
  const src = join(reportsDir, file);
  const dest = join(archiveDir, file);
  if (!existsSync(src)) {
    if (existsSync(dest)) {
      manifest.skippedAlreadyInArchive.push(file);
      continue;
    }
    manifest.missing.push(file);
    continue;
  }
  if (existsSync(dest)) {
    manifest.skippedAlreadyInArchive.push(file);
    continue;
  }
  if (dryRun) {
    console.log(`[dry-run] would move: ${file}`);
  } else {
    renameSync(src, dest);
    console.log(`archived: ${file}`);
  }
  manifest.moved.push(file);
}

if (!dryRun) {
  writeFileSync(join(archiveDir, 'lote12-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
}

console.log(
  `\nLote 12 ${dryRun ? '(dry-run)' : ''}: moved=${manifest.moved.length} missing=${manifest.missing.length} already=${manifest.skippedAlreadyInArchive.length}`,
);

if (manifest.missing.length) {
  process.exit(1);
}
