#!/usr/bin/env node
/**
 * EPIS2 OpenClaw handoff generator — read-only scaffold + optional notes.
 * Usage: node scripts/dev-agent/openclaw-handoff.mjs [--mf MF-*] [--agents ...] [--notes file.md] [--json]
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AGENT_CATALOG,
  buildHandoffMarkdown,
  dedupeEvolabFindings,
  formatEvolabFindingLine,
  listExisting,
  parseArgs,
  sanitizeText,
  suggestAgents,
  writeArtifact,
} from './openclaw-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

const args = parseArgs(process.argv);
const agentsArgIdx = process.argv.indexOf('--agents');
if (agentsArgIdx >= 0 && process.argv[agentsArgIdx + 1] === 'auto') {
  args.agents = suggestAgents({
    tramo: process.env.EPIS2_DEV_AGENT_TRAMO,
    phase: process.env.EPIS2_DEV_AGENT_PHASE,
  });
}
const timestamp = new Date().toISOString();
const invalid = args.agents.filter((id) => !AGENT_CATALOG[id]);
if (invalid.length) {
  console.error(`Unknown agents: ${invalid.join(', ')}`);
  process.exit(1);
}

const filesReviewed = [];
for (const agentId of args.agents) {
  for (const p of AGENT_CATALOG[agentId].paths) {
    filesReviewed.push(...listExisting(root, p, 10));
  }
}
const uniqueFiles = [...new Set(filesReviewed)].slice(0, 80);

let notesBlock = '';
if (args.notes && existsSync(args.notes)) {
  notesBlock = sanitizeText(readFileSync(args.notes, 'utf8'), args.notes);
}

function loadEvolabFindings() {
  const p = join(root, 'reports/evolab-open-findings.json');
  if (!existsSync(p)) return { count: 0, items: [] };
  try {
    const data = JSON.parse(readFileSync(p, 'utf8'));
    return { count: data.count ?? 0, items: data.findings ?? [] };
  } catch {
    return { count: 0, items: [] };
  }
}

function loadOllamaPlanHint() {
  const p = join(root, 'reports/dev-agent-ollama-plan.json');
  if (!existsSync(p)) return null;
  try {
    const data = JSON.parse(readFileSync(p, 'utf8'));
    return data.plan?.objective ?? data.plan?.nextMicrophase ?? null;
  } catch {
    return null;
  }
}

const evolab = loadEvolabFindings();
const ollamaHint = loadOllamaPlanHint();
const deduped = dedupeEvolabFindings(evolab.items);
const evolabCritical = deduped.filter((f) => f.severity === 'critical' || f.severity === 'high');
const evolabMedium = deduped.filter((f) => f.severity === 'medium' || f.severity === 'warn');

const findings = {
  filesReviewed: uniqueFiles,
  critical: evolabCritical.slice(0, 8).map(formatEvolabFindingLine),
  medium: evolabMedium.slice(0, 12).map(formatEvolabFindingLine),
  minor: [],
  invariants: [],
  suggestedCommands: [
    ...args.agents.flatMap((id) => (AGENT_CATALOG[id]?.gates ?? []).map((g) => `npm run ${g}`)),
    ...(evolab.count > 0 ? ['npm run evolab:findings', 'npm run dev:evolab:sync'] : []),
    ...(ollamaHint ? ['npm run dev:agent:ollama'] : []),
  ],
  cursorPrompt: notesBlock
    ? `Revisa el handoff OpenClaw EPIS2 para ${args.mf}. Notas del revisor:\n\n${notesBlock.slice(0, 6000)}`
    : `Revisa el handoff OpenClaw EPIS2 para ${args.mf}. Evolab: ${deduped.length} hallazgos únicos (${evolab.count} registros). Ollama: ${ollamaHint ?? 'sin plan'}. Aplica correcciones en Cursor bajo supervisión humana. No commits automáticos ni auto-aprobación clínica.`,
  recommendation:
    evolabCritical.length > 0
      ? 'Atender hallazgos Evolab críticos antes de cerrar tramo'
      : 'Continuar — completar hallazgos tras revisión OpenClaw + Evolab',
};

const markdown = buildHandoffMarkdown(root, {
  mf: args.mf,
  agents: args.agents,
  timestamp,
  findings,
});

const filename = `handoff-${args.mf.replace(/[^a-zA-Z0-9-]+/g, '-')}-${timestamp.replace(/[:.]/g, '-')}.md`;
const saved = writeArtifact(root, filename, markdown);

const latestPath = join(root, 'reports/openclaw-latest-handoff.md');
writeFileSync(latestPath, markdown, 'utf8');

const report = {
  ok: true,
  mf: args.mf,
  mode: 'read-only-reviewer',
  agents: args.agents,
  filesReviewed: uniqueFiles.length,
  artifact: saved,
  latest: 'reports/openclaw-latest-handoff.md',
  timestamp,
};

if (args.json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log('EPIS2 OpenClaw handoff\n');
  console.log(`Microfase: ${args.mf}`);
  console.log(`Agentes: ${args.agents.join(', ')}`);
  console.log(`Archivos indexados: ${uniqueFiles.length}`);
  console.log(`Artifact: ${saved}`);
  console.log(`Latest: reports/openclaw-latest-handoff.md`);
}

process.exit(0);
