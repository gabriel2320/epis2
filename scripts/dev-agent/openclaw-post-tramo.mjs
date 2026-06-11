#!/usr/bin/env node
/**
 * Post-tramo max-power — verify gate + ollama-auto dry-run + sync.
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { resolveOpenClawLocks } from './openclaw-policy.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const tramoIdx = args.includes('--tramo') ? Number(args[args.indexOf('--tramo') + 1]) : NaN;

if (Number.isNaN(tramoIdx)) {
  console.error('Uso: openclaw-post-tramo.mjs --tramo <N>');
  process.exit(1);
}

const locks = resolveOpenClawLocks();
if (locks.levelOrder < 3 && !locks.maxPower) {
  console.log('openclaw:post-tramo skip — requiere L3+ o MAX_POWER');
  process.exit(0);
}

function runNode(rel, nodeArgs = []) {
  const r = spawnSync(process.execPath, [join(root, rel), ...nodeArgs], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });
  return r.status === 0;
}

console.log(`\n▶ openclaw:post-tramo ${tramoIdx} (${locks.level} max-power)\n`);

if (locks.safeRun) {
  runNode('scripts/dev-agent/openclaw-verify-tramo.mjs', ['--tramo', String(tramoIdx)]);
}

if (process.env.EPIS2_AUTO_DEV_EVOLAB === '1') {
  console.log('\n▶ dev:evolab:sync (hallazgos → handoff)\n');
  runNode('scripts/dev-agent/evolab-sync.mjs');
}

runNode('scripts/dev-agent/dev-cycle-sync.mjs');
runNode('scripts/dev-agent/openclaw-sync.mjs');
console.log('\nopenclaw:post-tramo OK');
