#!/usr/bin/env node
/**
 * EPIS2 OpenClaw safe-patch — propuesta JSON + apply en zonas L0/L1 (low-risk-policy).
 *
 *   npm run openclaw:safe-patch -- --proposal .agent-runs/openclaw/patch-proposal.json [--apply]
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { applyLowRiskPatches } from './low-risk-policy.mjs';
import { sanitizeText, writeArtifact } from './openclaw-lib.mjs';
import {
  canUseSafePatch,
  loadPatchProposalJson,
  normalizeRepoPath,
  resolveOpenClawLocks,
  validatePatchProposalFiles,
} from './openclaw-policy.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const proposalIdx = args.indexOf('--proposal');
const proposal = proposalIdx >= 0 ? args[proposalIdx + 1] : null;
const apply = args.includes('--apply');

if (!proposal) {
  console.error(
    'Uso: openclaw-safe-patch.mjs --proposal .agent-runs/openclaw/patch-proposal.json [--apply]',
  );
  process.exit(1);
}

const locks = resolveOpenClawLocks();
if (!canUseSafePatch(locks)) {
  console.error(`[FAIL] safe-patch bloqueado (${locks.level} · patching=${locks.patchingEnabled})`);
  process.exit(1);
}

let data;
try {
  data = loadPatchProposalJson(root, proposal, { readFileSync, join, existsSync });
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

const files = data.files.map((f) => ({
  path: normalizeRepoPath(f.path),
  content: sanitizeText(String(f.content ?? ''), f.path),
  action: f.action ?? 'create',
}));

const validation = validatePatchProposalFiles(files, locks);
const reportLines = validation.results.map(
  (r) => `- \`${r.path}\` — ${r.tier} — ${r.allowed ? '✓' : '✗'} ${r.note}`,
);

const audit = {
  action: 'safe-patch',
  mf: data.mf ?? 'MF-OPENCLAW',
  level: locks.level,
  proposal,
  apply,
  validation,
  timestamp: new Date().toISOString(),
};

if (!validation.ok) {
  const saved = writeArtifact(
    root,
    `safe-patch-rejected-${Date.now()}.json`,
    `${JSON.stringify(audit, null, 2)}\n`,
  );
  console.error('PATCH REJECTED — política low-risk\n' + reportLines.join('\n'));
  console.error(`Audit: ${saved}`);
  process.exit(1);
}

if (!apply) {
  const saved = writeArtifact(
    root,
    `safe-patch-dryrun-${Date.now()}.json`,
    `${JSON.stringify(audit, null, 2)}\n`,
  );
  console.log(`DRY-RUN OK — ${files.length} archivo(s) · usar --apply para escribir`);
  console.log(reportLines.join('\n'));
  console.log(`Audit: ${saved}`);
  process.exit(0);
}

const applyTier = locks.authorizeCode && locks.levelOrder >= 3 ? 'L0+L1' : 'L0';
const result = applyLowRiskPatches(files, { root, applyTier });

audit.result = result;
const saved = writeArtifact(
  root,
  `safe-patch-applied-${Date.now()}.json`,
  `${JSON.stringify(audit, null, 2)}\n`,
);

console.log(
  `APPLIED ${result.applied.length} · SKIPPED ${result.skipped.length} · ERRORS ${result.errors.length}`,
);
result.applied.forEach(({ patch }) => console.log(`  ✓ ${patch.path}`));
for (const e of result.errors) console.error(`  ✗ ${e.patch.path}: ${e.error}`);
console.log(`Audit: ${saved}`);
console.log('NO COMMIT — revisar diff antes de PM-03/git');

process.exit(result.errors.length ? 1 : 0);
