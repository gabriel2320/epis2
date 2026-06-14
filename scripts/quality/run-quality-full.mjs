#!/usr/bin/env node
/**
 * Loop completo — pre-PR, cierre de tramo, PROG signoff.
 *   npm run quality:full
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

function run(npmScript) {
  console.log(`\n▶ npm run ${npmScript}\n`);
  const r = spawnSync('npm', ['run', npmScript], {
    cwd: root,
    shell: true,
    stdio: 'inherit',
  });
  if (r.status !== 0) {
    console.error(`\nquality:full FAILED at ${npmScript}`);
    process.exit(r.status ?? 1);
  }
}

console.log('EPIS2 quality:full\n');
run('check');
run('test');
run('db:validate');
console.log('\nquality:full OK');
