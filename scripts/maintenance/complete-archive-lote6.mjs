#!/usr/bin/env node
/**
 * Completa lote 6: quita duplicados en reports/ raíz cuando ya existen en archive.
 * No borra evidencia — solo elimina copia redundante en raíz.
 *   node scripts/maintenance/complete-archive-lote6.mjs [--dry-run]
 */
import { readFileSync, unlinkSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dryRun = process.argv.includes('--dry-run');
const manifestPath = join(root, 'reports/archive/2026-06/lote6-manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const archiveDir = join(root, 'reports/archive/2026-06');

let removed = 0;
let skipped = 0;

for (const file of manifest.moved) {
  const src = join(root, 'reports', file);
  const dest = join(archiveDir, file);
  if (!existsSync(dest)) {
    skipped++;
    continue;
  }
  if (!existsSync(src)) {
    skipped++;
    continue;
  }
  if (dryRun) {
    console.log(`[dry-run] remove duplicate root: ${file}`);
  } else {
    unlinkSync(src);
    console.log(`removed duplicate: ${file}`);
  }
  removed++;
}

console.log(`\n${dryRun ? 'Would remove' : 'Removed'} ${removed} duplicate(s), skipped ${skipped}`);
