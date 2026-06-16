#!/usr/bin/env node
/**
 * PROG-SCRIPT-DIET-3 — reduce scripts root a panel humano (≤18).
 *   node tools/scripts/prune-root-scripts-phase3.mjs
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT_SCRIPT_ALLOWLIST } from './root-script-allowlist.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const pkgPath = join(root, 'package.json');
const archivePath = join(root, 'tools/legacy-scripts/root-script-archive.json');

const allowSet = new Set(ROOT_SCRIPT_ALLOWLIST);

const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const allScripts = { ...(pkg.scripts ?? {}) };

/** @type {Record<string, string>} */
const archiveScripts = {};
const kept = {};

for (const [name, command] of Object.entries(allScripts)) {
  if (allowSet.has(name)) {
    kept[name] = command;
  } else {
    archiveScripts[name] = command;
  }
}

kept['tool:script'] = 'node tools/scripts/run-archived-script.mjs';

const removed = Object.keys(archiveScripts).length;
if (removed === 0) {
  console.log(`prune-phase3 OK — already pruned (${Object.keys(kept).length} root scripts)`);
  process.exit(0);
}

let mergedScripts = archiveScripts;
if (existsSync(archivePath)) {
  const existing = JSON.parse(readFileSync(archivePath, 'utf8'));
  mergedScripts = { ...(existing.scripts ?? {}), ...archiveScripts };
}

const archive = {
  version: 1,
  program: 'PROG-SCRIPT-DIET-3',
  generated: new Date().toISOString().slice(0, 10),
  note: 'Invocar: npm run tool:script -- <name> · gates: npm run quality:gate -- quality:<name>',
  scripts: mergedScripts,
};

writeFileSync(archivePath, JSON.stringify(archive, null, 2) + '\n');
pkg.scripts = kept;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`prune-phase3 OK — kept ${Object.keys(kept).length} root scripts, archived ${removed}`);
console.log(`  archive: tools/legacy-scripts/root-script-archive.json`);
