#!/usr/bin/env node
/**
 * OpenClaw por tramo auto-dev — brief pre o handoff post.
 *
 *   node scripts/dev-agent/openclaw-tramo.mjs --tramo 2 --phase brief
 *   node scripts/dev-agent/openclaw-tramo.mjs --tramo 4 --phase handoff
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { suggestAgentsForAutoTramo } from './openclaw-lib.mjs';
import { resolveOpenClawLocks } from './openclaw-policy.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const tramoIdx = args.includes('--tramo') ? Number(args[args.indexOf('--tramo') + 1]) : NaN;
const phase = args.includes('--phase') ? args[args.indexOf('--phase') + 1] : 'brief';

if (Number.isNaN(tramoIdx)) {
  console.error('Uso: openclaw-tramo.mjs --tramo <N> [--phase brief|handoff]');
  process.exit(1);
}

const ledgerPath = join(root, 'docs/quality/auto-dev-6h-ledger.json');
const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));
const tramo = ledger.tramos.find((t) => t.order === tramoIdx);
const mf = tramo?.id ?? `H-AUTO-${tramoIdx}`;
const agents = suggestAgentsForAutoTramo(tramoIdx).join(',');

const script =
  phase === 'handoff'
    ? join(root, 'scripts/dev-agent/openclaw-handoff.mjs')
    : join(root, 'scripts/dev-agent/openclaw-brief.mjs');

console.log(`openclaw-tramo: ${phase} tramo ${tramoIdx} (${mf}) agents=${agents}\n`);

const r = spawnSync(process.execPath, [script, '--mf', mf, '--agents', agents], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, EPIS2_DEV_AGENT_TRAMO: String(tramoIdx) },
});

if (r.status !== 0) process.exit(r.status ?? 1);

if (phase === 'handoff') {
  const locks = resolveOpenClawLocks();
  if (locks.safeRun || locks.maxPower) {
    console.log(`\n▶ openclaw:post-tramo ${tramoIdx}\n`);
    const p = spawnSync(
      process.execPath,
      [join(root, 'scripts/dev-agent/openclaw-post-tramo.mjs'), '--tramo', String(tramoIdx)],
      { cwd: root, stdio: 'inherit', env: process.env },
    );
    if (p.status !== 0) process.exit(p.status ?? 1);
  }
}

process.exit(0);
