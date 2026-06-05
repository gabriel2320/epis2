#!/usr/bin/env node
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const STEPS = [
  'validate-single-theme.mjs',
  'validate-material-color-roles.mjs',
  'validate-clinical-semantic-roles.mjs',
  'validate-light-dark-parity.mjs',
  'validate-theme-contrast.mjs',
  'validate-theme-copy-spanish.mjs',
  'validate-no-hardcoded-colors.mjs',
];

function run(script) {
  return new Promise((resolve, reject) => {
    const full = path.join(__dirname, script);
    const child = spawn(process.execPath, [full], { stdio: 'inherit', shell: false });
    child.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(script))));
  });
}

async function main() {
  console.log('EPIS2 theme:validate\n');
  let failed = 0;
  for (const step of STEPS) {
    try {
      await run(step);
    } catch {
      failed += 1;
    }
  }
  console.log('');
  if (failed > 0) {
    console.error(`theme:validate FAILED (${failed} paso(s))`);
    process.exit(1);
  }
  console.log('theme:validate OK — todos los gates de tema pasaron');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
