#!/usr/bin/env node
/**
 * Arranque de sesión dev IA — un comando, un brief.
 *
 *   npm run dev:session
 *   npm run dev:session -- --ollama-auto
 *   npm run dev:session -- --ollama-auto --apply
 *   npm run dev:session -- --tramo J
 *   EPIS2_DEV_SESSION_OLLAMA=1 npm run dev:session
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { buildDevBrief } from './brief.mjs';
import { buildSubagentPrompt, buildTramoImplementerPrompt } from './prompt-builder.mjs';
import { getActivePhaseHint, getGitSummary, suggestPrimarySubagent } from './context.mjs';
import { resolveSubagentSequence, ARCHIVED_SUBAGENT_IDS } from './subagents.mjs';
import { suggestAgents } from './openclaw-lib.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);

function hasFlag(flag) {
  return args.includes(flag);
}

function argValue(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

const tramo = (argValue('--tramo') ?? process.env.EPIS2_DEV_AGENT_TRAMO)?.toUpperCase();
if (tramo && process.env.EPIS2_ALLOW_ARCHIVED_SCOPE !== '1') {
  console.warn(
    `[dev:session] Tramo ${tramo} archivado — ignorado. Ver docs/archive/AGENT_SCOPE_EXCLUSIONS.md`,
  );
}
const phase =
  tramo && process.env.EPIS2_ALLOW_ARCHIVED_SCOPE === '1'
    ? 'tramo'
    : (argValue('--phase') ?? process.env.EPIS2_DEV_AGENT_PHASE ?? getActivePhaseHint(root));
const withOllama = hasFlag('--ollama') || process.env.EPIS2_DEV_SESSION_OLLAMA === '1';
const withOllamaAuto =
  hasFlag('--ollama-auto') || process.env.EPIS2_DEV_SESSION_OLLAMA_AUTO === '1';
const ollamaApply = hasFlag('--apply');
const withOpenClaw = hasFlag('--openclaw') || process.env.EPIS2_OPENCLAW_SESSION === '1';

mkdirSync(join(root, 'reports'), { recursive: true });

const effectiveTramo = tramo && process.env.EPIS2_ALLOW_ARCHIVED_SCOPE === '1' ? tramo : undefined;
const sequence = resolveSubagentSequence({ phase, tramo: effectiveTramo });
const git = getGitSummary(root);
const primarySubagent = suggestPrimarySubagent(git.files, { tramo: effectiveTramo, phase });

for (const id of sequence) {
  if (ARCHIVED_SUBAGENT_IDS.has(id)) continue;
  writeFileSync(
    join(root, `reports/dev-agent-prompt-${id}.md`),
    buildSubagentPrompt(root, id, { tramo: effectiveTramo, phase }),
    'utf8',
  );
}

if (tramo && process.env.EPIS2_ALLOW_ARCHIVED_SCOPE === '1') {
  writeFileSync(
    join(root, `reports/dev-agent-prompt-tramo-${tramo}.md`),
    buildTramoImplementerPrompt(root, tramo, process.env.EPIS2_DEV_AGENT_MF),
    'utf8',
  );
}

let ollamaNote = '';
if (withOllamaAuto) {
  const autoArgs = [];
  if (ollamaApply) autoArgs.push('--apply');
  const r = spawnSync(
    process.execPath,
    [join(root, 'scripts/dev-agent/ollama-automation.mjs'), ...autoArgs],
    {
      cwd: root,
      stdio: 'pipe',
      encoding: 'utf8',
      env: { ...process.env, EPIS2_DEV_AGENT_PHASE: phase, EPIS2_DEV_AGENT_TRAMO: tramo ?? '' },
    },
  );
  if (r.status === 0) {
    ollamaNote = ollamaApply ? ' · Ollama auto OK (apply L0)' : ' · Ollama auto OK (dry-run)';
  } else {
    ollamaNote = ' · Ollama auto falló';
    if (r.stderr || r.stdout) process.stderr.write(r.stderr || r.stdout);
  }
} else if (withOllama) {
  const r = spawnSync(process.execPath, [join(root, 'scripts/dev-agent/ollama-assist.mjs')], {
    cwd: root,
    stdio: 'pipe',
    encoding: 'utf8',
    env: { ...process.env, EPIS2_DEV_AGENT_PHASE: phase, EPIS2_DEV_AGENT_TRAMO: tramo ?? '' },
  });
  if (r.status === 0) {
    ollamaNote = ' · Ollama plan OK';
  } else {
    ollamaNote = ' · Ollama omitido (no disponible)';
    if (r.stderr || r.stdout) process.stderr.write(r.stderr || r.stdout);
  }
}

let openclawNote = '';
if (withOpenClaw) {
  const mf = process.env.EPIS2_DEV_AGENT_MF ?? 'auto';
  const agents = suggestAgents({ tramo, phase }).join(',');
  const r = spawnSync(
    process.execPath,
    [join(root, 'scripts/dev-agent/openclaw-brief.mjs'), '--mf', mf, '--agents', agents],
    { cwd: root, stdio: 'pipe', encoding: 'utf8', env: process.env },
  );
  openclawNote = r.status === 0 ? ' · OpenClaw brief OK' : ' · OpenClaw brief falló';
  if (r.status !== 0 && (r.stderr || r.stdout)) process.stderr.write(r.stderr || r.stdout);
}

const brief = await buildDevBrief(root, {
  phase,
  tramo: effectiveTramo,
  sequence,
  primarySubagent,
});
const briefPath = join(root, 'reports/dev-agent-brief.md');
writeFileSync(briefPath, brief, 'utf8');

console.log(`dev-session OK → ${briefPath}${ollamaNote}${openclawNote}`);
console.log(`  Subagente primario: ${primarySubagent}`);
console.log(`  Secuencia: ${sequence.join(' → ')}`);
console.log('');
if (withOpenClaw) {
  console.log(
    '  Cursor: @reports/dev-agent-brief.md @reports/archive/2026-06/openclaw-latest-brief.md',
  );
  console.log('           @reports/dev-agent-prompt-' + primarySubagent + '.md');
} else {
  console.log('  Cursor: @docs/AGENT_CONTEXT_MINIMAL.md @docs/archive/AGENT_SCOPE_EXCLUSIONS.md');
  console.log(
    '           @reports/dev-agent-brief.md @reports/dev-agent-prompt-' + primarySubagent + '.md',
  );
}
