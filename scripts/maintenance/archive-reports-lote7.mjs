#!/usr/bin/env node
/**
 * MF-PURGE-DOC-08 — archiva reportes superseded (lote 7).
 *   node scripts/maintenance/archive-reports-lote7.mjs [--dry-run]
 */
import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dryRun = process.argv.includes('--dry-run');
const archiveDir = join(root, 'reports/archive/2026-06');
const reportsDir = join(root, 'reports');

/** Superseded por brújula v1.4 / CICA / PROG-PRODUCT-MAP. No mover ≥ b2d6a00 pony/product closes. */
const LOTE7_FILES = [
  'epis2-ux-lab-baseline-2026-06-16.md',
  'epis2-ux-lab-tramo-b-close-2026-06-16.md',
  'epis2-ux-lab-tramo-c-close-2026-06-16.md',
  'epis2-ux-lab-close-2026-06-16.md',
  'epis2-uxlab-04-autopilot-close-2026-06-16.md',
  'epis2-ux-lab-human-signoff-2026-06-16.md',
  'epis2-m3-human-pilot-2026-06-16.md',
  'epis2-aesthetic-reset-session-2026-06-16.md',
  'epis2-aesthetic-architecture-audit-2026-06-16.md',
  'epis2-aesthetic-reset-close-2026-06-11.md',
  'epis2-pr-aest-07-cica-l-close.md',
  'epis2-cica-clean-room-redesign-2026-06-11.md',
  'epis2-cica-clean-room-redesign-2026-06-16.md',
  'epis2-session-close-2026-06-11-cica-clean-room.md',
  'epis2-audit-estado-2026-06-16.md',
  'epis2-situacion-actual-2026-06-16.md',
  'epis2-session-close-2026-06-15-consolidation-ola2.md',
  'epis2-session-close-2026-06-15-consolidation-2.md',
  'epis2-prog-gobierno-post-rc3-tramo1-close.md',
  'epis2-prog-deps-hygiene-tramo4-close.md',
];

if (!existsSync(archiveDir)) {
  mkdirSync(archiveDir, { recursive: true });
}

const manifest = {
  lote: 7,
  date: '2026-06-18',
  program: 'PROG-PRODUCT-MAP',
  mf: 'MF-PURGE-DOC-08',
  dryRun,
  moved: [],
  missing: [],
  skippedAlreadyInArchive: [],
};

for (const file of LOTE7_FILES) {
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
  writeFileSync(join(archiveDir, 'lote7-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
}

console.log(
  `\nLote 7 ${dryRun ? '(dry-run)' : ''}: moved=${manifest.moved.length} missing=${manifest.missing.length} already=${manifest.skippedAlreadyInArchive.length}`,
);

if (manifest.missing.length) {
  process.exit(1);
}
