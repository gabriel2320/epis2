#!/usr/bin/env node
/**
 * Actualiza gates que referencian reportes movidos a archive/2026-06.
 *   node scripts/maintenance/patch-gate-report-paths.mjs [--dry-run]
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dryRun = process.argv.includes('--dry-run');
const archivePrefix = 'reports/archive/2026-06/';

/** Report paths that moved in lote 6 — patch any `reports/<file>` reference */
const movedBasenames = new Set(
  JSON.parse(readFileSync(join(root, 'reports/archive/2026-06/lote6-manifest.json'), 'utf8')).moved,
);

const gateDir = join(root, 'scripts/quality');
const files = readdirSync(gateDir).filter((f) => f.endsWith('.mjs'));

let patched = 0;
for (const file of files) {
  const path = join(gateDir, file);
  let content = readFileSync(path, 'utf8');
  let changed = false;

  for (const basename of movedBasenames) {
    const oldPath = `reports/${basename}`;
    const newPath = `${archivePrefix}${basename}`;
    if (content.includes(oldPath) && !content.includes(newPath)) {
      content = content.split(oldPath).join(newPath);
      changed = true;
    }
  }

  if (changed) {
    patched++;
    if (dryRun) {
      console.log(`[dry-run] would patch: ${file}`);
    } else {
      writeFileSync(path, content, 'utf8');
      console.log(`patched: ${file}`);
    }
  }
}

console.log(`\n${patched} gate file(s) ${dryRun ? 'would be' : ''} patched`);
