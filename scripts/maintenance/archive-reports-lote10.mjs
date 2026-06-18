#!/usr/bin/env node
/**
 * MF-PURGE-DOC-10 — archiva MF CON + lexicon (lote 10).
 *   node scripts/maintenance/archive-reports-lote10.mjs [--dry-run]
 */
import { existsSync, mkdirSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dryRun = process.argv.includes('--dry-run');
const archiveDir = join(root, 'reports/archive/2026-06');
const reportsDir = join(root, 'reports');

/** PROG-CONSOLIDATE ola 2 + lexicon chain — evidencia en brújula / ARCHIVED_PROGRAMS_INDEX. */
const LOTE10_FILES = [
  'epis2-mf-con-03-governance.md',
  'epis2-mf-con-06-http-baseline.md',
  'epis2-mf-con-07-rate-limit.md',
  'epis2-mf-con-09-fixtures-devdeps.md',
  'epis2-mf-con-10-legal.md',
  'epis2-mf-con-11-ci-split.md',
  'epis2-mf-lx-01-clinical-action-manifest-2026-06-18.md',
  'epis2-mf-lx-02-clinical-lexicon-es-cl-2026-06-18.md',
  'epis2-mf-lx-03-drug-dictionary-cl-2026-06-18.md',
  'epis2-mf-lx-04-lab-dictionary-2026-06-18.md',
  'epis2-mf-lx-05-clinical-rules-2026-06-18.md',
  'epis2-mf-lx-06-ai-escalation-2026-06-18.md',
];

if (!existsSync(archiveDir)) {
  mkdirSync(archiveDir, { recursive: true });
}

const manifest = {
  lote: 10,
  date: '2026-06-18',
  program: 'PROG-PURGE-CICA',
  mf: 'MF-PURGE-DOC-10',
  dryRun,
  moved: [],
  missing: [],
  skippedAlreadyInArchive: [],
};

for (const file of LOTE10_FILES) {
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
  writeFileSync(join(archiveDir, 'lote10-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
}

console.log(
  `\nLote 10 ${dryRun ? '(dry-run)' : ''}: moved=${manifest.moved.length} missing=${manifest.missing.length} already=${manifest.skippedAlreadyInArchive.length}`,
);

if (manifest.missing.length) {
  process.exit(1);
}
