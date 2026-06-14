#!/usr/bin/env node
/**
 * Ejecuta quality:* desde tools/gates/catalog-full.json (PROG-CONSOLIDATE Fase 2).
 *   node tools/gates/run-legacy.mjs quality:ficha-first-gate
 *   npm run quality:gate -- quality:ficha-first-gate -- --extra
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const gatesDir = dirname(fileURLToPath(import.meta.url));

function loadCatalog() {
  for (const name of ['catalog-full.json', 'catalog.json']) {
    const path = join(gatesDir, name);
    if (existsSync(path)) {
      return JSON.parse(readFileSync(path, 'utf8'));
    }
  }
  console.error('catalog-full.json missing — run: npm run tool:gates:sync-catalog');
  process.exit(1);
}

function runShell(step, extraArgs = []) {
  const cmd = extraArgs.length ? `${step} ${extraArgs.join(' ')}` : step;
  const r = spawnSync(cmd, { cwd: root, shell: true, stdio: 'inherit' });
  return r.status ?? 1;
}

function runFile(relPath, extraArgs = []) {
  const args = [join(root, relPath), ...extraArgs];
  const r = spawnSync('node', args, { cwd: root, stdio: 'inherit' });
  return r.status ?? 1;
}

function parseQualitySteps(command) {
  return String(command)
    .split('&&')
    .map((s) => s.trim())
    .filter(Boolean);
}

function runCatalogGate(catalog, gateName, extraArgs, seen = new Set()) {
  if (seen.has(gateName)) {
    console.error(`Circular gate reference: ${gateName}`);
    return 1;
  }
  seen.add(gateName);

  const entry = catalog.gates?.[gateName];
  if (!entry) {
    console.error(`Unknown gate in catalog: ${gateName}`);
    return 1;
  }

  if (entry.type === 'file') {
    return runFile(entry.path, extraArgs);
  }

  const steps = parseQualitySteps(entry.command ?? '');
  for (const step of steps) {
    const qualityMatch = /^npm run (quality:[\w-]+)/.exec(step);
    if (qualityMatch) {
      const code = runCatalogGate(catalog, qualityMatch[1], [], new Set(seen));
      if (code !== 0) return code;
      continue;
    }
    const code = runShell(step, extraArgs);
    if (code !== 0) return code;
  }
  return 0;
}

const argv = process.argv.slice(2);
if (argv.length === 0 || argv[0] === '-h' || argv[0] === '--help') {
  console.error(`Usage:
  node tools/gates/run-legacy.mjs <quality:gate-name> [-- extra-args]
  npm run quality:gate -- <quality:gate-name>`);
  process.exit(argv.length === 0 ? 1 : 0);
}

const dashIdx = argv.indexOf('--');
const gateName = argv[0];
const extraArgs = dashIdx >= 0 ? argv.slice(dashIdx + 1) : [];

if (!gateName.startsWith('quality:')) {
  console.error(`Expected quality:* gate name, got: ${gateName}`);
  process.exit(1);
}

const catalog = loadCatalog();
const code = runCatalogGate(catalog, gateName, extraArgs);
process.exit(code);
