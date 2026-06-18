#!/usr/bin/env node
/** MF-KNIP-05-A — baseline KNIP-04 intact; exports triage documentado. */
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const reportPath = join(root, 'reports/knip-audit-product-map-baseline-2026-06-18.md');
if (!existsSync(reportPath)) {
  errors.push('falta reports/knip-audit-product-map-baseline-2026-06-18.md');
}

const run = spawnSync('npm', ['run', 'knip:audit', '--', '--reporter', 'compact'], {
  cwd: root,
  encoding: 'utf8',
  shell: true,
});
const out = `${run.stdout ?? ''}\n${run.stderr ?? ''}`;

/** @param {string} label */
function count(label) {
  const m = out.match(new RegExp(`^${label} \\((\\d+)\\)`, 'm'));
  return m ? Number(m[1]) : 0;
}

for (const label of [
  'Unused files',
  'Unused dependencies',
  'Unused devDependencies',
  'Unlisted dependencies',
  'Unlisted binaries',
  'Duplicate exports',
]) {
  const n = count(label);
  if (n > 0) errors.push(`${label}=${n} (KNIP-04 exige 0)`);
}

const exportCount = count('Unused exports');
const typeCount = count('Unused exported types');
if (exportCount === 0 && typeCount === 0) {
  errors.push('sin hallazgos exports/types — revisar knip entry');
}

if (existsSync(reportPath)) {
  const report = readFileSync(reportPath, 'utf8');
  if (!report.includes('DO_NOT_TOUCH') || !report.includes('needs-review')) {
    errors.push('reporte baseline sin triage DO_NOT_TOUCH / needs-review');
  }
  if (exportCount > 0 && !report.includes(String(exportCount))) {
    errors.push(`reporte debe documentar Unused exports (${exportCount})`);
  }
}

if (errors.length) {
  console.error('knip-05-a-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(
  `knip-05-a-gate OK — exports=${exportCount} types=${typeCount} · KNIP-04 metrics=0`,
);
