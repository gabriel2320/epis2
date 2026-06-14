#!/usr/bin/env node
/**
 * Clasifica scripts npm del root para PROG-CONSOLIDATE.
 *   npm run tool:scripts:classify
 * Salida: tools/legacy-scripts/scripts-classification.csv
 */
import { writeFileSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));

const KEEP_ROOT = new Set([
  'build',
  'build:packages',
  'check',
  'lint',
  'typecheck',
  'test',
  'format',
  'format:check',
  'architecture:validate',
  'db:migrate',
  'db:validate',
  'dev:api',
  'dev:web',
  'stack:dev',
  'stack:up',
  'quality:fast',
  'quality:clinical',
  'quality:full',
  'quality:required',
  'quality:nightly',
  'quality:ui',
  'quality:ai',
  'quality:gate',
  'tool:scripts:classify',
  'tool:gates:sync-catalog',
  'tool:gates:verify',
  'tool:gates:apply-phase2',
  'tool:workspaces:apply-phase3',
  'test:e2e',
]);

function classify(name) {
  if (KEEP_ROOT.has(name)) return 'KEEP_ROOT';

  if (name.startsWith('quality:')) {
    if (
      [
        'quality:fast',
        'quality:clinical',
        'quality:full',
        'quality:required',
        'quality:nightly',
        'quality:ui',
        'quality:ai',
      ].includes(name)
    ) {
      return 'KEEP_ROOT';
    }
    if (
      /^quality:(tramo|ola|week|te-|pa-|cm-|m3-|ficha-norm|dual-chart|classic-|dashboard-|paper-planner|three-modes|pm0)/.test(
        name,
      )
    ) {
      return 'ARCHIVE';
    }
    return 'MOVE_TO_TOOLS';
  }

  if (name.startsWith('test:e2e')) return 'MOVE_TO_WORKSPACE';
  if (name.startsWith('dev:') || name.startsWith('stack:'))
    return name.match(/^(dev:api|dev:web|stack:dev)$/) ? 'KEEP_ROOT' : 'MOVE_TO_TOOLS';
  if (
    name.startsWith('openclaw:') ||
    name.startsWith('dev:agent') ||
    name.startsWith('dev:auto') ||
    name.startsWith('dev:cycle') ||
    name.startsWith('dev:evolab') ||
    name.startsWith('dev:openclaw') ||
    name.startsWith('dev:velocity') ||
    name.startsWith('dev:rapid') ||
    name.startsWith('dev:session') ||
    name.startsWith('dev:dual-chart') ||
    name.startsWith('dev:install-hooks')
  ) {
    return 'MOVE_TO_TOOLS';
  }
  if (name.startsWith('evolab:')) return 'MOVE_TO_LABS';
  if (name.startsWith('case-intel:') || name.startsWith('drug-intel:')) return 'MOVE_TO_LABS';
  if (name.startsWith('ai:')) return 'MOVE_TO_TOOLS';
  if (
    name.startsWith('theme:') ||
    name.startsWith('figma:') ||
    name.startsWith('cursor:') ||
    name.startsWith('legacy:') ||
    name.startsWith('qa:') ||
    name.startsWith('storybook:')
  ) {
    return 'MOVE_TO_TOOLS';
  }
  if (name.startsWith('ollama:')) return 'MOVE_TO_TOOLS';
  if (name.startsWith('db:') && !['db:migrate', 'db:validate'].includes(name))
    return 'MOVE_TO_TOOLS';
  if (name.startsWith('test:')) return 'MOVE_TO_WORKSPACE';

  return 'NEEDS_REVIEW';
}

function csvEscape(value) {
  const s = String(value ?? '');
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const rows = [['script', 'action', 'command']];
for (const [name, command] of Object.entries(pkg.scripts ?? {}).sort(([a], [b]) =>
  a.localeCompare(b),
)) {
  rows.push([name, classify(name), command]);
}

const csv = rows.map((row) => row.map(csvEscape).join(',')).join('\n') + '\n';
const outPath = join(root, 'tools/legacy-scripts/scripts-classification.csv');
writeFileSync(outPath, csv);

const counts = {};
for (const row of rows.slice(1)) {
  counts[row[1]] = (counts[row[1]] ?? 0) + 1;
}

console.log(`scripts-classification.csv OK — ${rows.length - 1} scripts`);
for (const [action, n] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${action}: ${n}`);
}
