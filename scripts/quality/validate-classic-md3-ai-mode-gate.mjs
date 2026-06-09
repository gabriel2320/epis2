#!/usr/bin/env node
/** MF-CLASSIC-MD3-AI — modo clásico + agentes de diseño. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const modeGate = join(root, 'scripts/quality/validate-classic-md3-mode-gate.mjs');
if (!existsSync(modeGate)) errors.push('Falta validate-classic-md3-mode-gate.mjs');

const agentsDir = join(root, 'apps/web/src/design-agents');
const requiredAgents = [
  'schemas.ts',
  'designAgentsEnv.ts',
  'md3LayoutCriticAgent.ts',
  'commandCenterAgent.ts',
  'patchPlannerAgent.ts',
];
for (const f of requiredAgents) {
  if (!existsSync(join(agentsDir, f))) errors.push(`Falta design-agents/${f}`);
}

const envSrc = readFileSync(join(agentsDir, 'designAgentsEnv.ts'), 'utf8');
if (!envSrc.includes("enabledRaw === 'true'") && !envSrc.includes('enabled: false')) {
  errors.push('Agentes deben estar off por defecto');
}

if (errors.length) {
  console.error('classic-md3-ai-mode-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

import { spawnSync } from 'node:child_process';
const child = spawnSync(process.execPath, [modeGate], { stdio: 'inherit' });
if (child.status !== 0) process.exit(child.status ?? 1);

console.log('classic-md3-ai-mode-gate OK — MF-CLASSIC-MD3-AI-DESIGN-AGENTS');
