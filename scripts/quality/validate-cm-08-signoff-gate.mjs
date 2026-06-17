#!/usr/bin/env node
/** MF-CM-08 — signoff barra comando inteligente. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

if (!existsSync(join(root, 'reports/archive/2026-06/epis2-mf-cm-08-signoff.md'))) {
  errors.push('falta reports/archive/2026-06/epis2-mf-cm-08-signoff.md');
}

const e2e = readFileSync(join(root, 'e2e/ux-g02-command-first.spec.ts'), 'utf8');
for (const needle of [
  'Parte D: Ctrl+K',
  'Parte E: panel IA',
  'epis2-context-ai-panel',
  'epis2-clinical-command-palette',
]) {
  if (!e2e.includes(needle)) errors.push(`ux-g02 E2E falta ${needle}`);
}

const SUB_GATES = [
  'validate-cm-01-barra-gate.mjs',
  'validate-cm-02-palette-gate.mjs',
  'validate-cm-05-panel-ia-gate.mjs',
  'validate-cm-07-evals-gate.mjs',
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

const uxG02 = spawnSync('npm', ['run', 'quality:ux-g02'], {
  cwd: root,
  shell: true,
  stdio: 'inherit',
});
if (uxG02.status !== 0) errors.push('quality:ux-g02 falló');

const vitest = spawnSync(
  'npx',
  [
    'vitest',
    'run',
    'apps/web/src/components/ClinicalShellCommandPalette.test.tsx',
    'packages/command-registry/src/clinical-phrase-suite-50.test.ts',
  ],
  { cwd: root, shell: true, stdio: 'inherit' },
);
if (vitest.status !== 0) errors.push('vitest signoff CM-08 falló');

if (process.env.EPIS2_E2E_SIGNOFF === '1') {
  const e2eRun = spawnSync('npm', ['run', 'test:e2e:ux-g02'], {
    cwd: root,
    shell: true,
    stdio: 'inherit',
  });
  if (e2eRun.status !== 0) errors.push('test:e2e:ux-g02 falló');
} else {
  console.log(
    'E2E omitido (local): EPIS2_E2E_SIGNOFF=1 npm run stack:dev && npm run test:e2e:ux-g02',
  );
}

if (errors.length) {
  console.error('cm-08-signoff-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('cm-08-signoff-gate OK — MF-CM-08 barra comando inteligente');
