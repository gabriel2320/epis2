#!/usr/bin/env node
/** MF-PA-08 — signoff visual papel competitivo. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const auditPath = join(root, 'apps/web/src/components/chart/paper/audit/PaperVisualAudit.ts');
const signoffPath = join(root, 'docs/product/EPIS2_PAPER_MODE_CLINICAL_SIGNOFF.md');
const storiesPath = join(root, 'packages/epis2-ui/src/stories/ChartModesPreview.stories.tsx');
const e2ePath = join(root, 'e2e/dual-chart-modes.spec.ts');
const plannerE2ePath = join(root, 'e2e/paper-planner-journey.spec.ts');

for (const [label, path] of [
  ['PaperVisualAudit', auditPath],
  ['signoff doc', signoffPath],
  ['ChartModesPreview', storiesPath],
  ['dual-chart E2E', e2ePath],
  ['paper-planner E2E', plannerE2ePath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

if (existsSync(auditPath)) {
  const src = readFileSync(auditPath, 'utf8');
  for (const needle of [
    'PAPER_VISUAL_AUDIT_MIN_SCORE',
    'auditPaperVisualArtifacts',
    'hasCalmPaperCanvas',
    'hasPlannerCommandHints',
    '0.92',
  ]) {
    if (!src.includes(needle)) errors.push(`PaperVisualAudit falta ${needle}`);
  }
}

if (existsSync(e2ePath)) {
  const src = readFileSync(e2ePath, 'utf8');
  if (!src.includes('epis2-paper-chart-mode')) {
    errors.push('dual-chart E2E debe cubrir modo papel');
  }
}

if (existsSync(plannerE2ePath)) {
  const src = readFileSync(plannerE2ePath, 'utf8');
  for (const needle of [
    'epis2-paper-planner-day',
    'epis2-paper-planner-view-week',
    'epis2-paper-planner-view-month',
  ]) {
    if (!src.includes(needle)) errors.push(`paper-planner-journey falta ${needle}`);
  }
}

if (!existsSync(join(root, 'reports/archive/2026-06/epis2-mf-pa-08-signoff.md'))) {
  errors.push('falta reports/archive/2026-06/epis2-mf-pa-08-signoff.md');
}

const vitest = spawnSync(
  'npx',
  ['vitest', 'run', 'apps/web/src/components/chart/paper/audit/PaperVisualAudit.test.ts'],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) {
  errors.push('PaperVisualAudit.test.ts falló');
}

if (errors.length) {
  console.error('paper-mode-signoff-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('paper-mode-signoff-gate OK — MF-PA-08 signoff papel');
