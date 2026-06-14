#!/usr/bin/env node
/** MF-FF-01…03 — censo-first, dual chart default, /comando compat. */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validate as validateCommandCenterHome } from '../architecture/command-center-home.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  ['home.ts', 'apps/web/src/routes/home.ts'],
  ['router', 'apps/web/src/routes/router.tsx'],
  ['dual env', 'apps/web/src/dev/dualChartModesEnv.ts'],
  ['closure', 'reports/epis2-mf-ff-01-03-ficha-first.md'],
];

for (const [label, rel] of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${label}: ${rel}`);
}

const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
if (router.includes('CommandCenterPage')) {
  errors.push('router.tsx aún importa CommandCenterPage (debe ser redirect only)');
}
if (!router.includes("path: '/comando'")) {
  errors.push('router.tsx sin ruta /comando compat');
}

const homeGate = await validateCommandCenterHome();
if (!homeGate.ok) {
  errors.push(`command-center-home: ${homeGate.details?.join('; ') ?? homeGate.message}`);
}

function runVitest(label, paths) {
  const result = spawnSync('npx', ['vitest', 'run', ...paths], {
    cwd: root,
    shell: true,
    stdio: 'inherit',
  });
  if (result.status !== 0) errors.push(`${label} falló`);
}

runVitest('MF-FF router/dual', [
  'apps/web/src/routes/router.test.ts',
  'apps/web/src/dev/dualChartModesEnv.test.ts',
]);

if (errors.length) {
  console.error('ficha-first-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('ficha-first-gate OK — MF-FF-01/02/03');
