#!/usr/bin/env node
/**
 * Ejecuta gate del tramo vía openclaw:safe-run (L1 auto-dev).
 *
 *   npm run openclaw:verify-tramo -- --tramo 2
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { resolveOpenClawLocks } from './openclaw-policy.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const tramoIdx = args.includes('--tramo') ? Number(args[args.indexOf('--tramo') + 1]) : NaN;

if (Number.isNaN(tramoIdx)) {
  console.error('Uso: openclaw-verify-tramo.mjs --tramo <N>');
  process.exit(1);
}

const locks = resolveOpenClawLocks();
if (!locks.safeRun) {
  console.log(`openclaw:verify-tramo skip — EPIS2_OPENCLAW_SAFE_RUN=false (${locks.level})`);
  process.exit(0);
}

const ledger = JSON.parse(readFileSync(join(root, 'docs/quality/auto-dev-6h-ledger.json'), 'utf8'));
const tramo = ledger.tramos.find((t) => t.order === tramoIdx);
const gate = tramo?.gate;

if (!gate) {
  console.log(`openclaw:verify-tramo skip — tramo ${tramoIdx} sin gate`);
  process.exit(0);
}

const cmd = `npm run ${gate}`;
console.log(`openclaw:verify-tramo: ${tramo?.id ?? tramoIdx} → ${cmd}\n`);

const r = spawnSync(
  process.execPath,
  [join(root, 'scripts/dev-agent/openclaw-safe-run.mjs'), '--cmd', cmd],
  {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  },
);

process.exit(r.status ?? 1);
