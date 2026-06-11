#!/usr/bin/env node
/** MF-PAPER-09 — auditoría visual + signoff PROG-PAPER-MODE. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const auditPath = join(root, 'apps/web/src/components/chart/paper/audit/PaperVisualAudit.ts');
const signoffPath = join(root, 'docs/product/EPIS2_PAPER_MODE_CLINICAL_SIGNOFF.md');
const storiesPath = join(root, 'packages/epis2-ui/src/stories/ChartModesPreview.stories.tsx');

for (const [label, path] of [
  ['PaperVisualAudit', auditPath],
  ['signoff doc', signoffPath],
  ['ChartModesPreview', storiesPath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

if (existsSync(auditPath)) {
  const src = readFileSync(auditPath, 'utf8');
  for (const needle of ['PAPER_VISUAL_AUDIT_MIN_SCORE', 'auditPaperVisualArtifacts', '0.92']) {
    if (!src.includes(needle)) errors.push(`PaperVisualAudit falta ${needle}`);
  }
}

if (existsSync(storiesPath)) {
  const src = readFileSync(storiesPath, 'utf8');
  if (!src.includes('epis2-paper-page')) {
    errors.push('ChartModesPreview falta epis2-paper-page');
  }
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

console.log('paper-mode-signoff-gate OK — PROG-PAPER-MODE signoff');
