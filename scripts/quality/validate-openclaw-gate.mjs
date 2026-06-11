#!/usr/bin/env node
/** EPIS2 — gate OpenClaw L0–L4 + MAX POWER auto-dev. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'scripts/dev-agent/openclaw-policy.mjs',
  'scripts/dev-agent/openclaw-safe-patch.mjs',
  'scripts/dev-agent/openclaw-post-tramo.mjs',
  'scripts/dev-agent/openclaw-tramo.mjs',
  '.openclaw/epis2/policies/epis2-auto-dev-locks.md',
  'docs/product/EPIS2_OPENCLAW_INTEGRATION.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
for (const script of [
  'openclaw:policy',
  'openclaw:safe-run',
  'openclaw:safe-patch',
  'openclaw:post-tramo',
  'quality:openclaw-gate',
]) {
  if (!pkg.includes(`"${script}"`)) errors.push(`package.json sin ${script}`);
}

const policy = readFileSync(join(root, 'scripts/dev-agent/openclaw-policy.mjs'), 'utf8');
for (const token of [
  'MAX_POWER_LOCK_DEFAULTS',
  'PROFILE_MAP',
  'L3',
  'L4',
  'ALLOWLIST_PREFIXES_L4',
  'CONDITIONAL_COMMANDS',
  'canUseSafePatch',
  'validatePatchProposalFiles',
]) {
  if (!policy.includes(token)) errors.push(`openclaw-policy sin ${token}`);
}

const tramo = readFileSync(join(root, 'scripts/dev-agent/openclaw-tramo.mjs'), 'utf8');
if (!tramo.includes('openclaw-post-tramo')) errors.push('openclaw-tramo sin post-tramo');

const ps1 = readFileSync(join(root, 'scripts/dev-agent/start-auto-dev-6h.ps1'), 'utf8');
if (!ps1.includes('EPIS2_OPENCLAW_MAX_POWER')) errors.push('start-auto-dev-6h.ps1 sin MAX_POWER');

const envEx = readFileSync(join(root, '.env.example'), 'utf8');
if (!envEx.includes('EPIS2_OPENCLAW_MAX_POWER')) errors.push('.env.example sin MAX_POWER');

const doc = readFileSync(join(root, 'docs/product/EPIS2_OPENCLAW_INTEGRATION.md'), 'utf8');
if (!doc.includes('MAX POWER')) errors.push('OPENCLAW_INTEGRATION sin MAX POWER');

if (errors.length) {
  console.error('openclaw-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('openclaw-gate OK — OpenClaw MAX POWER L3 + perfiles L0–L4');
