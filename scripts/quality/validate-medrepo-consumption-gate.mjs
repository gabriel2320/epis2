#!/usr/bin/env node
/** MF-FF-14 — loader read-only MedRepo knowledge pack en API (sin PHI). */
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'apps/api/src/ai/medrepoKnowledgePack.ts',
  'apps/api/src/ai/fixtures/medrepo-knowledge-pack-demo.json',
  'apps/api/src/ai/medrepoKnowledgePack.test.ts',
  'reports/epis2-mf-ff-14-medrepo-loader.md',
]) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const routes = readFileSync(join(root, 'apps/api/src/ai/routes.ts'), 'utf8');
if (!routes.includes('getMedrepoAssistSafetyNotes')) {
  errors.push('routes.ts debe enriquecer safetyNotes con MedRepo (MF-FF-14)');
}
if (!routes.includes('/api/ai/medrepo-pack/status')) {
  errors.push('routes.ts debe exponer GET /api/ai/medrepo-pack/status');
}

const fixture = JSON.parse(
  readFileSync(join(root, 'apps/api/src/ai/fixtures/medrepo-knowledge-pack-demo.json'), 'utf8'),
);
if (fixture.safety?.containsPatientData !== false || fixture.safety?.humanReviewed !== true) {
  errors.push('Fixture demo debe ser sintético y humanReviewed=true');
}

function runVitest(label, paths) {
  const result = spawnSync('npx', ['vitest', 'run', ...paths], {
    cwd: root,
    shell: true,
    stdio: 'inherit',
  });
  if (result.status !== 0) errors.push(`${label} falló`);
}

runVitest('medrepoKnowledgePack', ['apps/api/src/ai/medrepoKnowledgePack.test.ts']);

if (errors.length) {
  console.error('medrepo-consumption-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('medrepo-consumption-gate OK — MF-FF-14');
