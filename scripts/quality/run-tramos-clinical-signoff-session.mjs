#!/usr/bin/env node
/**
 * Sesión automatizada pre-signoff clínico A–K → piloto.
 * No sustituye revisión humana ni acta institucional.
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

function run(label, cmd, args, env = process.env) {
  console.log(`\n▶ ${label}`);
  const result = spawnSync(cmd, args, {
    cwd: root,
    stdio: 'inherit',
    shell: process.platform === 'win32',
    env,
  });
  if (result.status !== 0) {
    console.error(`\nrun-tramos-clinical-signoff-session FAILED en: ${label}`);
    process.exit(result.status ?? 1);
  }
}

console.log('EPIS2 — sesión automatizada signoff clínico A–K (pre-humano)\n');

run('quality:tramos-signoff-prep-gate', 'npm', ['run', 'quality:tramos-signoff-prep-gate']);
run('quality:tramos-clinical-signoff-gate', 'npm', ['run', 'quality:tramos-clinical-signoff-gate']);
run('quality:tramos-hygiene-gate', 'npm', ['run', 'quality:tramos-hygiene-gate']);
run('quality:tramos-run-ak-closure-gates', 'npm', ['run', 'quality:tramos-run-ak-closure-gates']);
run('npm run check', 'npm', ['run', 'check']);
run('npm run test', 'npm', ['run', 'test']);
run('npm run db:validate', 'npm', ['run', 'db:validate']);
run('quality:golden-journey', 'npm', ['run', 'quality:golden-journey']);
run('quality:pilot-trial', 'npm', ['run', 'quality:pilot-trial']);

console.log(
  '\nrun-tramos-clinical-signoff-session OK — gates técnicos listos para signoff humano A–K',
);
console.log(
  'Siguiente: docs/product/EPIS2_PILOT_INSTITUTIONAL_WALKTHROUGH.md + acta fuera del repo',
);
