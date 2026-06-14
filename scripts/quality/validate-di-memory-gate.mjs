#!/usr/bin/env node
/** MF-DI-02 — memoria operacional por usuario. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'database/migrations/044_user_operational_memory.sql',
  'apps/api/src/user/operationalMemory.ts',
  'apps/api/src/user/operationalMemory.logic.ts',
  'apps/api/src/user/operationalMemory.logic.test.ts',
  'apps/api/src/user/routes.ts',
  'apps/web/src/clinical/useOperationalMemory.ts',
  'apps/web/src/api/userOperationalMemoryApi.ts',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const dual = readFileSync(join(root, 'apps/web/src/pages/DualChartPatientPage.tsx'), 'utf8');
if (!dual.includes('useOperationalMemory')) {
  errors.push('DualChartPatientPage debe usar memoria operacional');
}

const trad = readFileSync(join(root, 'apps/web/src/components/chart/TraditionalEhrMode.tsx'), 'utf8');
if (!trad.includes('onTraditionalSectionPersist')) {
  errors.push('TraditionalEhrMode debe persistir sección tradicional');
}

for (const suite of [
  'apps/api/src/user/operationalMemory.logic.test.ts',
  'database/tests/migration-044-user-operational-memory.test.mjs',
]) {
  const run = spawnSync('npx', ['vitest', 'run', '--run', suite], {
    cwd: root,
    shell: true,
    encoding: 'utf8',
  });
  if (run.status !== 0) errors.push(`${suite} falló`);
}

const dbValidate = spawnSync('npm', ['run', 'db:validate'], {
  cwd: root,
  shell: true,
  encoding: 'utf8',
});
if (dbValidate.status !== 0) errors.push('db:validate falló');

if (errors.length) {
  console.error('quality:di-memory-gate — FALLO');
  for (const e of errors) console.error(`  · ${e}`);
  process.exit(1);
}

console.log('quality:di-memory-gate — OK (MF-DI-02)');
