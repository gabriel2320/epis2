#!/usr/bin/env node
/** MF-PURGE-DOC-12 — hub product-map en raíz; MF individuales en archive. */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const archiveDir = join(root, 'reports/archive/2026-06');
const manifestPath = join(archiveDir, 'lote12-manifest.json');
const reportsDir = join(root, 'reports');

if (!existsSync(manifestPath)) {
  errors.push(
    'falta reports/archive/2026-06/lote12-manifest.json — ejecutar archive-reports-lote12.mjs',
  );
} else {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  if (manifest.moved.length < 8) {
    errors.push(`lote12 moved=${manifest.moved.length} (esperado ≥8)`);
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
  'epis2-mf-pony-gate-01-close.md',
  'knip-audit-pony-2026-06-18.md',
  'dev-agent-brief.md',
];
for (const file of keepInRoot) {
  if (!existsSync(join(reportsDir, file))) {
    errors.push(`debe permanecer en raíz: ${file}`);
  }
}

for (const file of ['epis2-mf-brujula-00-close.md', 'epis2-mf-catalog-00-close.md']) {
  if (existsSync(join(reportsDir, file))) {
    errors.push(`${file} debe estar archivado (hub product-map-close)`);
  }
}

const rootMdCount = readdirSync(reportsDir).filter((f) => f.endsWith('.md')).length;
if (rootMdCount >= 35) {
  errors.push(`reports/ raíz tiene ${rootMdCount} .md (meta post-lote12 <35)`);
}

const progClose = readFileSync(join(reportsDir, 'epis2-prog-product-map-close.md'), 'utf8');
if (!progClose.includes('archive/2026-06/epis2-mf-brujula-00-close.md')) {
  errors.push('epis2-prog-product-map-close debe enlazar MF evidencia a archive/2026-06');
}

const baselineArchive = join(archiveDir, 'knip-audit-product-map-baseline-2026-06-18.md');
if (!existsSync(baselineArchive)) {
  errors.push('falta knip baseline en archive/2026-06');
}

if (errors.length) {
  console.error('purge-doc-12-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(`purge-doc-12-gate OK — lote 12 · reports/ raíz=${rootMdCount} .md`);
