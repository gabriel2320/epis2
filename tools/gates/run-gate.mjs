#!/usr/bin/env node
/**
 * EPIS2 gate runner — manifiestos en tools/gates/*.json
 *   node tools/gates/run-gate.mjs required|nightly|experimental
 *   node tools/gates/run-gate.mjs run <npm-script-name>
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const gatesDir = dirname(fileURLToPath(import.meta.url));

function usage() {
  console.error(`Usage:
  node tools/gates/run-gate.mjs <required|nightly|experimental>
  node tools/gates/run-gate.mjs run <quality:*|npm-script>
  node tools/gates/run-gate.mjs --dry-run <manifest>`);
  process.exit(1);
}

function loadManifest(name) {
  const path = join(gatesDir, `${name}.json`);
  if (!existsSync(path)) {
    console.error(`Gate manifest not found: ${path}`);
    process.exit(1);
  }
  return JSON.parse(readFileSync(path, 'utf8'));
}

function runStep(step, dryRun) {
  console.log(`\n▶ ${step}`);
  if (dryRun) return 0;
  const r = spawnSync(step, {
    cwd: root,
    shell: true,
    stdio: 'inherit',
  });
  return r.status ?? 1;
}

function runManifest(manifest, dryRun) {
  console.log(`EPIS2 gate: ${manifest.name}${dryRun ? ' (dry-run)' : ''}\n`);
  if (manifest.description) console.log(manifest.description + '\n');
  for (const step of manifest.steps) {
    const code = runStep(step, dryRun);
    if (code !== 0) {
      console.error(`\n✖ Gate "${manifest.name}" failed at: ${step}`);
      process.exit(code);
    }
  }
  console.log(`\n✅ Gate "${manifest.name}" passed`);
}

function runCatalogScript(scriptName, dryRun) {
  const catalogPath = join(gatesDir, 'catalog.json');
  if (!existsSync(catalogPath)) {
    console.error('catalog.json missing — run: npm run tool:gates:sync-catalog');
    process.exit(1);
  }
  const catalog = JSON.parse(readFileSync(catalogPath, 'utf8'));
  const entry = catalog.gates?.[scriptName];
  if (!entry) {
    console.error(`Unknown gate in catalog: ${scriptName}`);
    process.exit(1);
  }
  if (entry.type === 'file') {
    return runStep(`node ${entry.path}`, dryRun);
  }
  return runStep(entry.command ?? `npm run ${scriptName}`, dryRun);
}

const argv = process.argv.slice(2);
if (argv.length === 0) usage();

const dryRun = argv[0] === '--dry-run';
const args = dryRun ? argv.slice(1) : argv;

if (args[0] === 'run') {
  if (!args[1]) usage();
  const code = runCatalogScript(args[1], dryRun);
  if (code !== 0) process.exit(code);
  if (!dryRun) console.log(`\n✅ ${args[1]} OK`);
  process.exit(0);
}

const manifestName = args[0];
if (!manifestName || !['required', 'nightly', 'experimental'].includes(manifestName)) {
  usage();
}

runManifest(loadManifest(manifestName), dryRun);
