#!/usr/bin/env node
/**
 * MF-PURGE-DOC-11 — archiva prog closes históricos (lote 11).
 *   node scripts/maintenance/archive-reports-lote11.mjs [--dry-run]
 */
import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dryRun = process.argv.includes('--dry-run');
const archiveDir = join(root, 'reports/archive/2026-06');
const reportsDir = join(root, 'reports');

/** Programas cerrados — brújula + product-map-close. Conservar post-rc3 hub en raíz. */
const LOTE11_FILES = [
  'epis2-prog-agent-truth-close-2026-06-16.md',
  'epis2-prog-conciliacion-triada-close-2026.md',
  'epis2-prog-consolidate-close-2026.md',
  'epis2-prog-consolidate-ola2-close-2026.md',
  'epis2-prog-core-labs-fw-close-2026-06-16.md',
  'epis2-prog-demo-safety-close-2026-06-16.md',
  'epis2-prog-di-close-2026.md',
  'epis2-prog-ficha-first-close-2026.md',
  'epis2-prog-script-diet-3-close-2026-06-16.md',
  'epis2-prog-strengthen-close-2026.md',
  'epis2-prog-release-hardening-rh01-08.md',
  'epis2-prog-release-hardening-rh06-web.md',
  'epis2-prog-security-promote-tramo5-rh09.md',
  'epis2-prog-security-promote-tramo5-rh10.md',
  'epis2-prog-security-promote-tramo5-rh11.md',
  'epis2-prog-legal-disclaimer-tramo3-mf-leg-01.md',
  'epis2-prog-purge-cica-session-2026-06-16.md',
  'epis2-prog-purge-cica-audit-2026-06-17.md',
  'epis2-session-close-2026-06-16-release-hardening.md',
  'epis2-session-close-2026-06-17.md',
  'epis2-v0.1-demo-rc3-release.md',
  'epis2-branch-protection-verify-2026-06-16.md',
  'gates-inventory-2026-06.md',
  'epis2-print-norm-documentation.md',
];

if (!existsSync(archiveDir)) {
  mkdirSync(archiveDir, { recursive: true });
}

const manifest = {
  lote: 11,
  date: '2026-06-18',
  program: 'PROG-PURGE-CICA',
  mf: 'MF-PURGE-DOC-11',
  dryRun,
  moved: [],
  missing: [],
  skippedAlreadyInArchive: [],
};

for (const file of LOTE11_FILES) {
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
  writeFileSync(join(archiveDir, 'lote11-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
}

console.log(
  `\nLote 11 ${dryRun ? '(dry-run)' : ''}: moved=${manifest.moved.length} missing=${manifest.missing.length} already=${manifest.skippedAlreadyInArchive.length}`,
);

if (manifest.missing.length) {
  process.exit(1);
}
