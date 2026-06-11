#!/usr/bin/env node
/**
 * Publica archivos Code Connect (.figma.ts) a Figma.
 *
 *   FIGMA_ACCESS_TOKEN=figd_... npm run figma:connect:publish
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const token = process.env.FIGMA_ACCESS_TOKEN?.trim();

if (!token) {
  console.error('FIGMA_ACCESS_TOKEN no definido. Añade a .env o exporta en la sesión.');
  console.error('Ver docs/dev/EPIS2_FIGMA_CODE_CONNECT.md');
  process.exit(1);
}

const args = ['figma', 'connect', 'publish', `--token=${token}`, ...process.argv.slice(2)];
const result = spawnSync('npx', args, { cwd: root, stdio: 'inherit', shell: true });

process.exit(result.status ?? 1);
