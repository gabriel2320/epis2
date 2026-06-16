#!/usr/bin/env node
/**
 * Ejecuta scripts npm archivados (PROG-SCRIPT-DIET-3).
 *   npm run tool:script -- dev:agent:ollama
 *   npm run tool:script -- case-intel:scrape -- -- --source catalog
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const archivePath = join(
  dirname(fileURLToPath(import.meta.url)),
  '../legacy-scripts/root-script-archive.json',
);

const rawArgs = process.argv.slice(2);
if (!rawArgs.length) {
  console.error('Uso: npm run tool:script -- <script-name> [-- extra args]');
  process.exit(1);
}

if (!existsSync(archivePath)) {
  console.error('Falta tools/legacy-scripts/root-script-archive.json');
  process.exit(1);
}

const archive = JSON.parse(readFileSync(archivePath, 'utf8'));
const scriptName = rawArgs[0];
const command = archive.scripts?.[scriptName];

if (!command) {
  console.error(`Script archivado no encontrado: ${scriptName}`);
  console.error('Índice: docs/dev/SCRIPT_INDEX.md');
  process.exit(1);
}

let extra = rawArgs.slice(1);
if (extra[0] === '--') extra = extra.slice(1);

const fullCmd = extra.length
  ? `${command} ${extra.map((a) => JSON.stringify(a)).join(' ')}`
  : command;
const result = spawnSync(fullCmd, { cwd: root, shell: true, stdio: 'inherit' });
process.exit(result.status ?? 1);
