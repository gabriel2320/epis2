#!/usr/bin/env node
/** MF-PURGE-09 — lab/design-agents + frontera clínica. */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const gate = join(root, 'scripts/quality/validate-web-no-design-agents-in-clinical-gate.mjs');

const child = spawnSync(process.execPath, [gate], { stdio: 'inherit' });
if (child.status !== 0) process.exit(child.status ?? 1);

console.log('purge-09-gate OK — design-agents en lab/');
