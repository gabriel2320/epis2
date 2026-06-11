#!/usr/bin/env node
/**
 * EPIS2 OpenClaw — agente de programación y apoyo (read-only + sugerencias).
 *
 *   npm run openclaw:programming -- --tramo 2
 *   npm run openclaw:programming -- --mf H-AUTO-2
 *   npm run openclaw:programming -- --tramo 1 --json
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import {
  AGENT_CATALOG,
  AUTO_DEV_TRAMO_AGENTS,
  buildBriefMarkdown,
  listExisting,
  suggestAgentsForAutoTramo,
  writeArtifact,
} from './openclaw-lib.mjs';
import { resolveOpenClawLocks } from './openclaw-policy.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const args = process.argv.slice(2);
const jsonOut = args.includes('--json');
const tramoIdx = args.includes('--tramo') ? Number(args[args.indexOf('--tramo') + 1]) : NaN;
const mfArg = args.includes('--mf') ? args[args.indexOf('--mf') + 1] : null;

const ledgerPath = join(root, 'docs/quality/auto-dev-6h-ledger.json');
const ledger = JSON.parse(readFileSync(ledgerPath, 'utf8'));

let order = tramoIdx;
let tramo = Number.isNaN(order) ? null : ledger.tramos.find((t) => t.order === order);
if (mfArg && !tramo) {
  tramo = ledger.tramos.find((t) => t.id === mfArg);
  order = tramo?.order ?? NaN;
}
if (!tramo || Number.isNaN(order)) {
  console.error('Uso: openclaw:programming -- --tramo <N> | --mf H-AUTO-N [--json]');
  process.exit(1);
}

const mf = tramo.id;
const agents = suggestAgentsForAutoTramo(order);
const locks = resolveOpenClawLocks();
const timestamp = new Date().toISOString();
const cursorPrompt = join(root, `reports/auto-dev-cursor-prompt-tramo-${order}.md`);
const lockPath = join(root, 'reports/auto-dev-parallel.lock.json');
const lockActive = existsSync(lockPath);

const programming = AGENT_CATALOG.programming;
const indexedFiles = [];
for (const p of programming.paths) {
  indexedFiles.push(...listExisting(root, p, 12));
}

const suggestedCommands = [
  `npm run openclaw:tramo -- --tramo ${order} --phase brief`,
  'npm run ollama:route',
  'npm run dev:agent:ollama',
  ...(existsSync(cursorPrompt)
    ? [`# Cursor: @reports/auto-dev-cursor-prompt-tramo-${order}.md @reports/openclaw-latest-brief.md`]
    : [`npm run dev:auto:6h -- --tramo ${order}`]),
  `npm run dev:auto:6h -- --tramo ${order}`,
  'npm run dev:agent:ollama-auto -- --skip-plan',
  'npm run openclaw:safe-run -- --cmd "npm run check"',
  'npm run dev:cycle:sync',
  'npm run dev:openclaw:sync',
];

if ([2, 4, 6].includes(order)) {
  suggestedCommands.push(`npm run openclaw:tramo -- --tramo ${order} --phase handoff`);
  suggestedCommands.push(`npm run openclaw:verify-tramo -- --tramo ${order}`);
}

const report = {
  ok: true,
  agent: 'programming',
  mf,
  tramo: order,
  tramoName: tramo.name,
  tier: tramo.tier ?? null,
  locks: {
    level: locks.level,
    maxPower: locks.maxPower,
    safeRun: locks.safeRun,
    patchingEnabled: locks.patchingEnabled,
    gitWrite: locks.gitWrite,
  },
  parallelLockActive: lockActive,
  openclawAgents: agents,
  skill: programming.skill,
  suggestedCommands,
  artifacts: {
    brief: 'reports/openclaw-latest-brief.md',
    handoff: 'reports/openclaw-latest-handoff.md',
    cursorPrompt: existsSync(cursorPrompt) ? relativeReport(cursorPrompt) : null,
    cycleStatus: 'reports/epis2-dev-cycle-status.json',
    ollamaPlan: 'reports/dev-agent-ollama-automation.json',
    ollamaWrite: 'reports/dev-agent-ollama-write-plan.json',
  },
  indexedFileCount: indexedFiles.length,
  generatedAt: timestamp,
};

function relativeReport(abs) {
  return abs.replace(/\\/g, '/').split('/reports/').pop()
    ? `reports/${abs.replace(/\\/g, '/').split('/reports/').pop()}`
    : abs;
}

const markdown = [
  '# EPIS2 — Programming Agent (OpenClaw apoyo)',
  '',
  `> **Tramo ${order}** — \`${mf}\`: ${tramo.name}`,
  `> **Perfil OpenClaw:** ${locks.level} · safe-run=${locks.safeRun} · git-write=${locks.gitWrite}`,
  `> **Generado:** ${timestamp}`,
  '',
  '## Rol',
  '',
  'Agente de programación y orquestación dev (L3). Planifica con Ollama nativo; OpenClaw brief/handoff; Cursor implementa. **No** coder L5 autónomo.',
  '',
  lockActive
    ? '⚠ **Lock activo:** `reports/auto-dev-parallel.lock.json` — no lanzar segundo ciclo paralelo.'
    : '✓ Sin lock paralelo activo.',
  '',
  '## Agentes OpenClaw sugeridos (tramo)',
  '',
  ...agents.map((id) => `- \`${id}\` — ${AGENT_CATALOG[id]?.name ?? id}`),
  '',
  '## Comandos sugeridos (orden)',
  '',
  '```bash',
  ...suggestedCommands,
  '```',
  '',
  '## Skill programming',
  '',
  `\`${programming.skill}\``,
  '',
  '## Gates',
  '',
  ...programming.gates.map((g) => `- \`npm run ${g}\``),
  '',
  '## Brief slice (programming paths)',
  '',
  buildBriefMarkdown(root, { mf, agents: ['programming'], timestamp }).split('\n').slice(15, 45).join('\n'),
  '',
].join('\n');

const saved = writeArtifact(
  root,
  `programming-support-${mf}-${timestamp.replace(/[:.]/g, '-')}.md`,
  markdown,
);
const latestPath = join(root, 'reports/openclaw-programming-latest.md');
writeFileSync(latestPath, markdown, 'utf8');

if (jsonOut) {
  console.log(JSON.stringify({ ...report, artifact: saved, latest: 'reports/openclaw-programming-latest.md' }, null, 2));
} else {
  console.log(`openclaw:programming OK — tramo ${order} (${mf})\n`);
  console.log(`  Skill: ${programming.skill}`);
  console.log(`  Agentes: ${agents.join(', ')}`);
  console.log(`  Lock paralelo: ${lockActive ? 'ACTIVO' : 'no'}`);
  console.log(`  Latest: reports/openclaw-programming-latest.md`);
  console.log('\nComandos sugeridos:');
  for (const cmd of suggestedCommands) console.log(`  ${cmd}`);
}
