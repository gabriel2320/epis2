#!/usr/bin/env node
/** MF-UXLAB-04 — gate wrapper for UX-LAB Autopilot audit-only. */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const r = spawnSync('node', ['tools/ux-lab-autopilot/autopilot.mjs', '--mode', 'audit-only'], {
  cwd: root,
  stdio: 'inherit',
});

process.exit(r.status ?? 1);
