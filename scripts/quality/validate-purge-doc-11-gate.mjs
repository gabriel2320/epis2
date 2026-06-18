#!/usr/bin/env node
/** MF-PURGE-DOC-11 — lote 11 prog closes archivados + punteros canon. */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const archiveDir = join(root, 'reports/archive/2026-06');
const manifestPath = join(archiveDir, 'lote11-manifest.json');
const reportsDir = join(root, 'reports');

if (!existsSync(manifestPath)) {
  errors.push(
    'falta reports/archive/2026-06/lote11-manifest.json — ejecutar archive-reports-lote11.mjs',
  );
} else {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.moved.length < 10) {
    errors.push(`lote11 moved=${manifest.moved.length} (esperado ≥10)`);
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
  'epis2-prog-post-rc3-close.md',
  'epis2-prog-product-map-close.md',
  'epis2-prog-dev-parity-tramo2-close.md',
  'epis2-prog-legal-disclaimer-tramo3-close.md',
  'epis2-mf-pony-gate-01-close.md',
  'knip-audit-pony-2026-06-18.md',
  'dev-agent-brief.md',
];
for (const file of keepInRoot) {
  if (!existsSync(join(reportsDir, file))) {
    errors.push(`debe permanecer en raíz: ${file}`);
  }
}

const rootMdCount = readdirSync(reportsDir).filter((f) => f.endsWith('.md')).length;
if (rootMdCount >= 50) {
  errors.push(`reports/ raíz tiene ${rootMdCount} .md (meta post-lote11 <50)`);
}

const index = readFileSync(join(root, 'docs/archive/ARCHIVED_PROGRAMS_INDEX.md'), 'utf8');
if (index.includes('`epis2-prog-ficha-first-close-2026.md`')) {
  errors.push('ARCHIVED_PROGRAMS_INDEX aún apunta ficha-first sin prefijo archive/');
}
if (!index.includes('archive/2026-06/epis2-prog-ficha-first-close-2026.md')) {
  errors.push('ARCHIVED_PROGRAMS_INDEX debe apuntar ficha-first a archive/2026-06');
}

const currentState = readFileSync(join(root, 'docs/EPIS2_CURRENT_STATE.md'), 'utf8');
if (currentState.includes('../reports/epis2-prog-consolidate-ola2-close-2026.md')) {
  errors.push('EPIS2_CURRENT_STATE aún apunta consolidate-ola2 a reports/ raíz');
}
if (currentState.includes('../reports/epis2-prog-ficha-first-close-2026.md')) {
  errors.push('EPIS2_CURRENT_STATE aún apunta ficha-first a reports/ raíz');
}

const freeze = readFileSync(join(root, 'docs/CONSOLIDATION_FREEZE.md'), 'utf8');
if (freeze.includes('../reports/epis2-prog-consolidate-close-2026.md')) {
  errors.push('CONSOLIDATION_FREEZE aún apunta consolidate-close a reports/ raíz');
}

if (errors.length) {
  console.error('purge-doc-11-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`purge-doc-11-gate OK — lote 11 · reports/ raíz=${rootMdCount} .md`);
