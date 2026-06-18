#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dir = join(root, 'apps/web/src/design-agents');
const errors = [];
const required = ['dashboardDesignAgents.ts', 'schemas.ts', 'designAgentsEnv.ts'];
for (const f of required) {
  if (!existsSync(join(dir, f))) errors.push(`Falta ${f}`);
}
const schemas = readFileSync(join(dir, 'schemas.ts'), 'utf8');
for (const s of [
  'DashboardMd3CriticResultSchema',
  'DashboardWorkflowResultSchema',
  'PatchPlanSchema',
]) {
  if (!schemas.includes(s)) errors.push(`Falta ${s}`);
}
const envSrc = readFileSync(join(dir, 'designAgentsEnv.ts'), 'utf8');
if (!envSrc.includes("enabledRaw === 'true'")) {
  errors.push('Agentes deben estar off por defecto (enabled solo con true)');
}
const agentsSrc = readFileSync(join(dir, 'dashboardDesignAgents.ts'), 'utf8');
if (agentsSrc.includes('../api/')) errors.push('Agentes dashboard no deben llamar API');
if (errors.length) {
  console.error(
    'dashboard-design-agents-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}
console.log('dashboard-design-agents-gate OK');
