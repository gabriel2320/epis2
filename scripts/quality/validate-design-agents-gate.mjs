#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dir = join(root, 'apps/web/src/design-agents');
const errors = [];
const agents = [
  'md3LayoutCriticAgent.ts',
  'classicEmrWorkflowAgent.ts',
  'commandCenterAgent.ts',
  'visualDensityAgent.ts',
  'clinicalSafetyUiAgent.ts',
  'accessibilityAgent.ts',
  'screenshotCriticAgent.ts',
  'patchPlannerAgent.ts',
];
for (const f of agents) {
  const p = join(dir, f);
  if (!existsSync(p)) {
    errors.push(`Falta ${f}`);
    continue;
  }
  const src = readFileSync(p, 'utf8');
  if (src.includes('../api/') || src.includes('../../api/clinical')) {
    errors.push(`${f} no debe llamar API clínica`);
  }
  if (src.includes('firmar') || src.includes('approveDraft')) {
    errors.push(`${f} no debe firmar/aprobar`);
  }
}
const patch = readFileSync(join(dir, 'patchPlannerAgent.ts'), 'utf8');
if (!patch.includes('Solo planifica')) {
  errors.push('patchPlannerAgent debe ser solo planificación');
}
if (errors.length) {
  console.error('design-agents-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('design-agents-gate OK');
