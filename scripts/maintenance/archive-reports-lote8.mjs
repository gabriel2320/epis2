#!/usr/bin/env node
/**
 * MF-PURGE-DOC-09 — archiva cierres MF pony individuales (lote 8).
 *   node scripts/maintenance/archive-reports-lote8.mjs [--dry-run]
 */
import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dryRun = process.argv.includes('--dry-run');
const archiveDir = join(root, 'reports/archive/2026-06');
const reportsDir = join(root, 'reports');

/** Superseded por MF-PONY-GATE-01 + PROG-PRODUCT-MAP. Conservar pony-gate-01 + knip-audit-pony en raíz. */
const LOTE8_FILES = [
  'epis2-mf-pony-01-close.md',
  'epis2-mf-pony-02-close.md',
  'epis2-mf-pony-03-close.md',
  'epis2-mf-pony-04-close.md',
  'epis2-mf-pony-05-close.md',
  'epis2-mf-pony-06-close.md',
  'epis2-mf-pony-07-close.md',
  'epis2-mf-pony-doc-01-close.md',
  'epis2-mf-pony-knip-00-close.md',
  'epis2-mf-pony-knip-01-close.md',
  'epis2-mf-pony-knip-02-close.md',
  'epis2-mf-pony-knip-02a-close.md',
  'epis2-mf-pony-knip-02b-close.md',
  'epis2-mf-pony-knip-02c-close.md',
  'epis2-mf-pony-knip-02d-close.md',
  'epis2-mf-pony-knip-03-close.md',
  'epis2-mf-pony-knip-04-close.md',
  'epis2-ponytail-correction-plan-2026-06-18.md',
];

if (!existsSync(archiveDir)) {
  mkdirSync(archiveDir, { recursive: true });
}

const manifest = {
  lote: 8,
  date: '2026-06-18',
  program: 'PROG-PURGE-CICA',
  mf: 'MF-PURGE-DOC-09',
  dryRun,
  moved: [],
  missing: [],
  skippedAlreadyInArchive: [],
};

for (const file of LOTE8_FILES) {
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
  writeFileSync(join(archiveDir, 'lote8-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
}

console.log(
  `\nLote 8 ${dryRun ? '(dry-run)' : ''}: moved=${manifest.moved.length} missing=${manifest.missing.length} already=${manifest.skippedAlreadyInArchive.length}`,
);

if (manifest.missing.length) {
  process.exit(1);
}
