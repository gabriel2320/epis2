#!/usr/bin/env node
/** Ejecuta Playwright desde la raíz del monorepo (PROG-CONSOLIDATE Fase 3). */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const rawArgs = process.argv.slice(2);
const fresh = rawArgs.includes('--fresh');
const args = rawArgs.filter((a) => a !== '--fresh');

if (fresh) {
  process.env.PLAYWRIGHT_REUSE_EXISTING_SERVER = 'false';
  process.env.PLAYWRIGHT_WEB_PORT = process.env.PLAYWRIGHT_WEB_PORT ?? '5199';
  process.env.PLAYWRIGHT_WEB_URL =
    process.env.PLAYWRIGHT_WEB_URL ?? `http://127.0.0.1:${process.env.PLAYWRIGHT_WEB_PORT}`;
}

const r = spawnSync('npx', ['playwright', 'test', '--config', 'playwright.config.ts', ...args], {
  cwd: root,
  shell: true,
  stdio: 'inherit',
});

process.exit(r.status ?? 1);
