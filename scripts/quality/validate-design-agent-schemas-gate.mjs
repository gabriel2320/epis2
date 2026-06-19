#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const src = readFileSync(join(root, 'apps/web/src/lab/design-agents/schemas.ts'), 'utf8');
const required = [
  'Md3LayoutCriticResultSchema',
  'ClassicEmrWorkflowResultSchema',
  'CommandCenterCriticResultSchema',
  'VisualDensityResultSchema',
  'ClinicalSafetyUiResultSchema',
  'AccessibilityResultSchema',
  'ScreenshotCriticResultSchema',
  'PatchPlanSchema',
  'DashboardMd3CriticResultSchema',
  'DashboardWorkflowResultSchema',
  'PatchPlanSchema',
];
const errors = required.filter((s) => !src.includes(s)).map((s) => `Falta ${s}`);
if (!src.includes("from 'zod'")) errors.push('schemas.ts debe usar Zod');
if (errors.length) {
  console.error('design-agent-schemas-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('design-agent-schemas-gate OK');
