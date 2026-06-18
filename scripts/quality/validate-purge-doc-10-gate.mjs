#!/usr/bin/env node
/** MF-PURGE-DOC-10 — lote 10 CON/lexicon archivado + punteros docs. */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const archiveDir = join(root, 'reports/archive/2026-06');
const manifestPath = join(archiveDir, 'lote10-manifest.json');
const reportsDir = join(root, 'reports');

if (!existsSync(manifestPath)) {
  errors.push(
    'falta reports/archive/2026-06/lote10-manifest.json — ejecutar archive-reports-lote10.mjs',
  );
} else {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.moved.length < 10) {
    errors.push(`lote10 moved=${manifest.moved.length} (esperado ≥10)`);
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
  'epis2-prog-product-map-close.md',
  'epis2-prog-post-rc3-close.md',
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
if (rootMdCount >= 70) {
  errors.push(`reports/ raíz tiene ${rootMdCount} .md (meta post-lote10 <70)`);
}

const legal = readFileSync(join(root, 'docs/legal/EPIS2_LEGAL_REVIEW_CHECKLIST.md'), 'utf8');
if (legal.includes('reports/epis2-mf-con-10-legal.md')) {
  errors.push('EPIS2_LEGAL_REVIEW_CHECKLIST aún apunta con-10 a reports/ raíz');
}
if (!legal.includes('reports/archive/2026-06/epis2-mf-con-10-legal.md')) {
  errors.push('EPIS2_LEGAL_REVIEW_CHECKLIST debe apuntar con-10 a archive/2026-06');
}

const reportsReadme = readFileSync(join(root, 'reports/README.md'), 'utf8');
if (reportsReadme.includes('`epis2-mf-con-07-rate-limit.md`')) {
  errors.push('reports/README.md aún apunta con-07 a reports/ raíz');
}

if (errors.length) {
  console.error('purge-doc-10-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`purge-doc-10-gate OK — lote 10 · reports/ raíz=${rootMdCount} .md`);
