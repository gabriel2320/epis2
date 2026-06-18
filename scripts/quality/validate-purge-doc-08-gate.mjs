#!/usr/bin/env node
/** MF-PURGE-DOC-08 — lote 7 archivado + punteros docs. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const archiveDir = join(root, 'reports/archive/2026-06');
const manifestPath = join(archiveDir, 'lote7-manifest.json');

if (!existsSync(manifestPath)) {
  errors.push('falta reports/archive/2026-06/lote7-manifest.json — ejecutar archive-reports-lote7.mjs');
} else {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.moved.length < 10) {
    errors.push(`lote7 moved=${manifest.moved.length} (esperado ≥10)`);
  }
  for (const file of manifest.moved) {
    if (existsSync(join(root, 'reports', file))) {
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
];
for (const file of keepInRoot) {
  if (!existsSync(join(root, 'reports', file))) {
    errors.push(`debe permanecer en raíz: ${file}`);
  }
}

const uxLab = readFileSync(join(root, 'docs/quality/EPIS2_UX_LAB_MODERN_PLAN.md'), 'utf8');
if (uxLab.includes('reports/epis2-ux-lab-baseline-2026-06-16.md')) {
  errors.push('EPIS2_UX_LAB_MODERN_PLAN.md aún apunta baseline a reports/ raíz');
}
if (!uxLab.includes('reports/archive/2026-06/epis2-ux-lab-baseline')) {
  errors.push('EPIS2_UX_LAB_MODERN_PLAN.md debe apuntar baseline a archive/2026-06');
}

const aesthetic = readFileSync(join(root, 'docs/product/EPIS2_AESTHETIC_RESET_PROGRAM.md'), 'utf8');
if (aesthetic.includes('reports/epis2-aesthetic-architecture-audit-2026-06-16.md')) {
  errors.push('EPIS2_AESTHETIC_RESET_PROGRAM.md aún apunta audit a reports/ raíz');
}

if (errors.length) {
  console.error('purge-doc-08-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('purge-doc-08-gate OK — lote 7 archive + punteros');
