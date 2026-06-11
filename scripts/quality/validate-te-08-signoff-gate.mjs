#!/usr/bin/env node
/** MF-TE-08 — signoff ficha electrónica competitiva. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

if (!existsSync(join(root, 'reports/epis2-mf-te-08-signoff.md'))) {
  errors.push('falta reports/epis2-mf-te-08-signoff.md');
}

const navPath = join(root, 'apps/web/src/components/chart/TraditionalSectionNav.tsx');
const navSrc = readFileSync(navPath, 'utf8');
const sectionCount = (navSrc.match(/'nav/g) ?? []).length;
if (sectionCount < 17) {
  errors.push(`TraditionalSectionNav debe listar 17 secciones (encontradas ~${sectionCount})`);
}

const e2e = readFileSync(join(root, 'e2e/dual-chart-modes.spec.ts'), 'utf8');
for (const needle of ['epis2-traditional-ehr-mode', 'chartMode=traditional']) {
  if (!e2e.includes(needle)) errors.push(`dual-chart E2E falta ${needle}`);
}

const SUB_GATES = ['validate-te-07-tabular-gate.mjs', 'validate-ficha-norm-signoff-gate.mjs'];

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

const demoVitest = spawnSync(
  'npx',
  [
    'vitest',
    'run',
    'packages/test-fixtures/src/demoChartSections.test.ts',
    'packages/clinical-forms/src/chart-section-mirror.test.ts',
  ],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (demoVitest.status !== 0) errors.push('demo chart sections / mirror tests fallaron');

if (errors.length) {
  console.error('te-08-signoff-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('te-08-signoff-gate OK — MF-TE-08 (piloto 15 min + capturas light/dark: manual)');
