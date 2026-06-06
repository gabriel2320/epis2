#!/usr/bin/env node
/** MF-179 — ensayo formal piloto (golden journey + M3 + microphases). */
import { spawnSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

function run(label, cmd, args, env = process.env) {
  console.log(`\n▶ ${label}`);
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
  });
  if (result.status !== 0) {
    console.error(`run-pilot-trial FAILED en: ${label}`);
    process.exit(result.status ?? 1);
  }
}

run('quality:golden-journey', 'npm', ['run', 'quality:golden-journey']);
run('verify-m3-signoff', 'node', ['scripts/quality/verify-m3-signoff.mjs']);
run('quality:microphases', 'npm', ['run', 'quality:microphases']);
console.log('\nrun-pilot-trial OK — PILOT_DEMO_CHECKLIST automatizado + M3 signoff');
