#!/usr/bin/env node
/** MF-TE-06 — supporting pane timeline denso + filtros kind. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const panePath = join(root, 'apps/web/src/components/EpisClinicalContextPane.tsx');
const panelPath = join(root, 'apps/web/src/components/chart/ClinicalRightContextPanel.tsx');

for (const [label, path] of [
  ['EpisClinicalContextPane', panePath],
  ['ClinicalRightContextPanel', panelPath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

const pane = readFileSync(panePath, 'utf8');
for (const needle of [
  'filterTimelineByKind',
  'CLINICAL_SUMMARY_TIMELINE_KINDS',
  'epis2-context-timeline-kind-filters',
  'kindFilter',
]) {
  if (!pane.includes(needle)) errors.push(`EpisClinicalContextPane falta ${needle}`);
}

const panel = readFileSync(panelPath, 'utf8');
if (!panel.includes('contextEventCount')) {
  errors.push('ClinicalRightContextPanel debe exponer contextEventCount');
}

if (!existsSync(join(root, 'reports/epis2-mf-te-06-supporting-pane.md'))) {
  errors.push('falta reports/epis2-mf-te-06-supporting-pane.md');
}

const vitest = spawnSync(
  'npx',
  ['vitest', 'run', 'apps/web/src/components/EpisClinicalContextPane.test.tsx'],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) errors.push('EpisClinicalContextPane.test falló');

if (errors.length) {
  console.error('te-06-supporting-pane-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('te-06-supporting-pane-gate OK — MF-TE-06');
