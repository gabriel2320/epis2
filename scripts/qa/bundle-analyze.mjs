#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const distAssets = join(root, 'apps/web/dist/assets');

/** Presupuestos M3-09 (gzip, KB). */
const BUDGETS_KB_GZIP = {
  'mui-x-grid': 150,
  'mui-x-charts': 120,
  'mui-x-scheduler': 200,
  'mui-x-other': 100,
};

function gzipSizeKb(filePath) {
  const raw = readFileSync(filePath);
  return gzipSync(raw).length / 1024;
}

function chunkKey(fileName) {
  if (fileName.includes('mui-x-grid')) return 'mui-x-grid';
  if (fileName.includes('mui-x-charts')) return 'mui-x-charts';
  if (fileName.includes('mui-x-scheduler')) return 'mui-x-scheduler';
  if (fileName.includes('mui-x-other')) return 'mui-x-other';
  return null;
}

console.log('EPIS2 bundle analyze (M3-09)\n');

process.env.ANALYZE = 'true';
execSync('npm run build -w @epis2/design-system && npm run build -w @epis2/epis2-ui', {
  cwd: root,
  stdio: 'inherit',
});
execSync('npx vite build', {
  cwd: join(root, 'apps/web'),
  stdio: 'inherit',
  env: { ...process.env, ANALYZE: 'true' },
});

const files = readdirSync(distAssets).filter((f) => f.endsWith('.js'));
const rows = [];
const totals = {};

for (const file of files.sort()) {
  const path = join(distAssets, file);
  const gzipKb = gzipSizeKb(path);
  const rawKb = statSync(path).size / 1024;
  rows.push({ file, gzipKb, rawKb });
  const key = chunkKey(file);
  if (key) totals[key] = (totals[key] ?? 0) + gzipKb;
}

console.log('\n--- Chunks (gzip KB) ---');
for (const row of rows) {
  console.log(
    `${row.file.padEnd(48)} ${row.gzipKb.toFixed(1).padStart(8)} gzip  ${row.rawKb.toFixed(1).padStart(8)} raw`,
  );
}

console.log('\n--- Presupuestos MUI X ---');
let failed = 0;
for (const [key, limit] of Object.entries(BUDGETS_KB_GZIP)) {
  const actual = totals[key] ?? 0;
  const ok = actual <= limit || actual === 0;
  const note = actual === 0 ? '(lazy — no en entry)' : ok ? 'OK' : 'EXCEDE';
  if (!ok && actual > 0) failed += 1;
  console.log(`${key.padEnd(18)} ${actual.toFixed(1).padStart(7)} / ${limit} KB gzip  ${note}`);
}

console.log(`\nReporte HTML: apps/web/dist/bundle-stats.html`);

if (failed > 0) {
  console.error(`\nbundle-analyze FAILED: ${failed} chunk(s) exceden presupuesto`);
  process.exit(1);
}

console.log('\nbundle-analyze OK');
