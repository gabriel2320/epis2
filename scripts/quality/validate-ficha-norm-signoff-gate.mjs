#!/usr/bin/env node
/** MF-NORM-11 — signoff paridad visual papel↔electrónica. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const NORM_REPORTS = [
  'reports/epis2-mf-norm-00-benchmark.md',
  'reports/epis2-mf-norm-01-contract.md',
  'reports/epis2-mf-norm-02-viewport.md',
  'reports/epis2-mf-norm-03-command-compact.md',
  'reports/epis2-mf-norm-04-shape.md',
  'reports/epis2-mf-norm-05-typography.md',
  'reports/epis2-mf-norm-06-demo.md',
  'reports/epis2-mf-norm-07-theme.md',
  'reports/epis2-mf-norm-08-motion.md',
  'reports/epis2-mf-norm-09-sections-b1.md',
  'reports/epis2-mf-norm-10-sections-b2.md',
  'reports/epis2-mf-norm-11-signoff.md',
];

for (const rel of [
  'docs/design/EPIS2_FICHA_NORM_SIGNOFF_CHECKLIST.md',
  ...NORM_REPORTS,
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta: ${rel}`);
}

const checklist = readFileSync(
  join(root, 'docs/design/EPIS2_FICHA_NORM_SIGNOFF_CHECKLIST.md'),
  'utf8',
);
if (!checklist.includes('quality:ficha-norm-signoff-gate')) {
  errors.push('checklist signoff sin referencia gate');
}

const visibility = readFileSync(
  join(root, 'apps/web/src/components/chart/traditionalSectionVisibility.ts'),
  'utf8',
);
if (!visibility.includes('resolveVisibleTraditionalSections')) {
  errors.push('traditionalSectionVisibility incompleto');
}

const e2e = readFileSync(join(root, 'e2e/dual-chart-modes.spec.ts'), 'utf8');
for (const needle of ['MF-NORM-11', 'navAntecedents', 'chartMode=paper']) {
  if (!e2e.includes(needle)) errors.push(`dual-chart E2E falta ${needle}`);
}

const SUB_GATES = [
  'validate-ficha-norm-mirror-b2-gate.mjs',
  'validate-ficha-norm-density-gate.mjs',
  'validate-cm-02-palette-gate.mjs',
  'validate-paper-mode-fichapapel-reference-gate.mjs',
];

for (const script of SUB_GATES) {
  const result = spawnSync(process.execPath, [join(root, 'scripts/quality', script)], {
    stdio: 'pipe',
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    errors.push(`${script} falló`);
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }
}

const vitest = spawnSync(
  'npx',
  ['vitest', 'run', 'packages/clinical-forms/src/chart-section-mirror.test.ts'],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) errors.push('chart-section-mirror tests fallaron');

if (errors.length) {
  console.error('ficha-norm-signoff-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ficha-norm-signoff-gate OK — MF-NORM-11');
