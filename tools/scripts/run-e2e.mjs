#!/usr/bin/env node
/** Ejecuta Playwright desde la raíz del monorepo (PROG-CONSOLIDATE Fase 3). */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);

const r = spawnSync('npx', ['playwright', 'test', '--config', 'playwright.config.ts', ...args], {
  cwd: root,
  shell: true,
  stdio: 'inherit',
});

process.exit(r.status ?? 1);
