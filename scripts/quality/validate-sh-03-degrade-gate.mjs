#!/usr/bin/env node
/** MF-SH-03 — degradación IA (Ollama down): formulario manual + resolveCommand sin assist. */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  ['form degrade test', 'apps/web/src/pages/GeneratedClinicalFormPage.degrade.test.tsx'],
  ['command degrade contract', 'packages/test-fixtures/src/aiDegradeContract.test.ts'],
  ['closure report', 'reports/epis2-mf-sh-03-degrade.md'],
];

for (const [label, rel] of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${label}: ${rel}`);
}

function runVitest(label, paths) {
  const result = spawnSync('npx', ['vitest', 'run', ...paths], {
    cwd: root,
    shell: true,
    stdio: 'inherit',
  });
  if (result.status !== 0) errors.push(`${label} falló`);
}

runVitest('MF-SH-03 degrade suite', [
  'apps/web/src/pages/GeneratedClinicalFormPage.degrade.test.tsx',
  'packages/test-fixtures/src/aiDegradeContract.test.ts',
  'services/local-ai/src/assist.test.ts',
  'apps/api/src/ai/routes.test.ts',
  'apps/web/src/clinical/useClinicalCommandSubmit.test.ts',
]);

if (errors.length) {
  console.error('sh-03-degrade-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('sh-03-degrade-gate OK — MF-SH-03');
