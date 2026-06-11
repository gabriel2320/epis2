#!/usr/bin/env node
/**
 * EPIS2 OpenClaw brief generator — read-only, no external calls.
 * Usage: node scripts/dev-agent/openclaw-brief.mjs [--mf MF-*] [--agents security,ux,...] [--json]
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  AGENT_CATALOG,
  buildBriefMarkdown,
  parseArgs,
  suggestAgents,
  writeArtifact,
} from './openclaw-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

const args = parseArgs(process.argv);
const timestamp = new Date().toISOString();

const agentsArgIdx = process.argv.indexOf('--agents');
if (agentsArgIdx >= 0 && process.argv[agentsArgIdx + 1] === 'auto') {
  args.agents = suggestAgents({
    tramo: process.env.EPIS2_DEV_AGENT_TRAMO,
    phase: process.env.EPIS2_DEV_AGENT_PHASE,
  });
}

const invalid = args.agents.filter((id) => !AGENT_CATALOG[id]);
if (invalid.length) {
  console.error(`Unknown agents: ${invalid.join(', ')}`);
  process.exit(1);
}

const markdown = buildBriefMarkdown(root, { mf: args.mf, agents: args.agents, timestamp });
const filename = `brief-${args.mf.replace(/[^a-zA-Z0-9-]+/g, '-')}-${timestamp.replace(/[:.]/g, '-')}.md`;
const saved = writeArtifact(root, filename, markdown);

const latestPath = join(root, 'reports/openclaw-latest-brief.md');
writeFileSync(latestPath, markdown, 'utf8');

const report = {
  ok: true,
  mf: args.mf,
  mode: 'read-only-reviewer',
  agents: args.agents,
  artifact: saved,
  latest: 'reports/openclaw-latest-brief.md',
  timestamp,
};

if (args.json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log('EPIS2 OpenClaw brief\n');
  console.log(`Microfase: ${args.mf}`);
  console.log(`Agentes: ${args.agents.join(', ')}`);
  console.log(`Artifact: ${saved}`);
  console.log(`Latest: reports/openclaw-latest-brief.md\n`);
  console.log(markdown);
}

process.exit(0);
