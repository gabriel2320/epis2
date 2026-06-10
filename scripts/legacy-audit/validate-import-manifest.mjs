#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { REPOS } from './paths.mjs';

const MANIFEST = path.join(REPOS.EPIS2, 'legacy-import-manifest.json');
const VALID_CLASS = new Set([
  'MIGRATE_AS_IS',
  'MIGRATE_WITH_ADAPTATION',
  'REWRITE_FROM_CONCEPT',
  'REFERENCE_ONLY',
  'REJECT',
]);
const VALID_STATUS = new Set([
  'DISCOVERED',
  'REVIEW_REQUIRED',
  'APPROVED_FOR_EXTRACTION',
  'EXTRACTED_TO_QUARANTINE',
  'ADAPTED',
  'TESTED',
  'APPROVED_FOR_INTEGRATION',
  'REJECTED',
]);
const FORBIDDEN_SOURCE = [
  /node_modules/i,
  /package-lock/i,
  /\.env$/i,
  /openmrs[\\/]/i,
  /@openmrs/i,
];

let fail = 0;

if (!fs.existsSync(MANIFEST)) {
  console.error('FALTA legacy-import-manifest.json');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
if (manifest.version !== 1) {
  console.error('manifest.version debe ser 1');
  fail++;
}
if (!Array.isArray(manifest.entries)) {
  console.error('manifest.entries debe ser array');
  process.exit(1);
}

for (const entry of manifest.entries) {
  const id = entry.id ?? '(sin id)';
  for (const field of ['id', 'sourceProject', 'sourcePath', 'classification', 'status', 'reason']) {
    if (!entry[field]) {
      console.error(`${id}: falta ${field}`);
      fail++;
    }
  }
  if (!VALID_CLASS.has(entry.classification)) {
    console.error(`${id}: clasificación inválida`);
    fail++;
  }
  if (!VALID_STATUS.has(entry.status)) {
    console.error(`${id}: status inválido`);
    fail++;
  }
  if (FORBIDDEN_SOURCE.some((re) => re.test(entry.sourcePath ?? ''))) {
    console.error(`${id}: sourcePath prohibido`);
    fail++;
  }
  if (entry.status === 'EXTRACTED_TO_QUARANTINE' && !entry.quarantinePath) {
    console.error(`${id}: EXTRACTED requiere quarantinePath`);
    fail++;
  }
}

console.log(`manifest: ${manifest.entries.length} entradas, ${fail} errores`);
process.exit(fail ? 1 : 0);
