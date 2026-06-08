#!/usr/bin/env node
/**
 * Orquestador de subagentes de desarrollo EPIS2.
 *
 * Uso:
 *   node scripts/dev-agent/orchestrate.mjs                    # sesión Fase B
 *   node scripts/dev-agent/orchestrate.mjs --tramo K
 *   node scripts/dev-agent/orchestrate.mjs --subagent golden-guardian
 *   EPIS2_DEV_AGENT_PHASE=B node scripts/dev-agent/orchestrate.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDevBrief } from './brief.mjs';
import {
  buildSessionIndex,
  buildSubagentPrompt,
  buildTramoImplementerPrompt,
} from './prompt-builder.mjs';
import { getActivePhaseHint, getGitSummary, suggestPrimarySubagent } from './context.mjs';
import { listSubagentIds, resolveSubagentSequence } from './subagents.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);

function argValue(flag) {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
}

const tramo = (argValue('--tramo') ?? process.env.EPIS2_DEV_AGENT_TRAMO)?.toUpperCase();
const phase = argValue('--phase') ?? process.env.EPIS2_DEV_AGENT_PHASE ?? getActivePhaseHint(root);
const mf = process.env.EPIS2_DEV_AGENT_MF ?? (tramo ? `MF-TRAMO-${tramo}-002` : undefined);
const subagentOnly =
  argValue('--subagent') ?? args.find((a) => !a.startsWith('--') && listSubagentIds().includes(a));

mkdirSync(join(root, 'reports'), { recursive: true });

if (subagentOnly) {
  if (!listSubagentIds().includes(subagentOnly)) {
    console.error(`dev-agent-orchestrate FAILED: subagente desconocido "${subagentOnly}"`);
    process.exit(1);
  }
  const prompt = buildSubagentPrompt(root, subagentOnly, { tramo, mf, phase });
  const out = join(root, `reports/dev-agent-prompt-${subagentOnly}.md`);
  writeFileSync(out, prompt, 'utf8');
  console.log(`dev-agent-orchestrate OK → ${out}`);
  process.exit(0);
}

const sequence = resolveSubagentSequence({ phase, tramo });

for (const id of sequence) {
  const prompt = buildSubagentPrompt(root, id, { tramo, mf, phase });
  writeFileSync(join(root, `reports/dev-agent-prompt-${id}.md`), prompt, 'utf8');
}

const sessionPath = join(root, 'reports/dev-agent-session.md');
writeFileSync(sessionPath, buildSessionIndex(root, { phase, tramo, sequence }), 'utf8');

if (tramo) {
  const tramoPath = join(root, `reports/dev-agent-prompt-tramo-${tramo}.md`);
  writeFileSync(tramoPath, buildTramoImplementerPrompt(root, tramo, mf), 'utf8');
}

const git = getGitSummary(root);
const primarySubagent = suggestPrimarySubagent(git.files, { tramo, phase });
const brief = await buildDevBrief(root, { phase, tramo, sequence, primarySubagent });
writeFileSync(join(root, 'reports/dev-agent-brief.md'), brief, 'utf8');

if (tramo) {
  console.log(`dev-agent-orchestrate OK → ${sessionPath} (+ tramo ${tramo})`);
} else {
  console.log(`dev-agent-orchestrate OK → ${sessionPath}`);
}

console.log(`  Brief: reports/dev-agent-brief.md · primario: ${primarySubagent}`);
console.log(`  Subagentes: ${sequence.join(', ')}`);
