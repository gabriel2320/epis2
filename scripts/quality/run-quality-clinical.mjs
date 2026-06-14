#!/usr/bin/env node
/**
 * Loop clínico — toques API/web/packages clínicos o cierre de microfase.
 *   npm run quality:clinical
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

function run(label, npmScript, required = true, extraArgs = []) {
  process.stdout.write(`\n▶ ${label}\n`);
  const args = ['run', npmScript, ...extraArgs];
  const r = spawnSync('npm', args, {
    cwd: root,
    shell: true,
    stdio: 'inherit',
  });
  if (r.status !== 0 && required) {
    console.error(`\nquality:clinical FAILED at ${npmScript}`);
    process.exit(r.status ?? 1);
  }
  return r.status === 0;
}

console.log('EPIS2 quality:clinical\n');

run('quality:fast', 'quality:fast', true);
run('db:validate', 'db:validate', true);
run('microphase ledger', 'quality:microphases', false);
run('velocity gates (fast)', 'dev:velocity:gates', false, ['--', '--fast']);

console.log('\nquality:clinical OK');
console.log('Pre-PR / release: npm run quality:full');
