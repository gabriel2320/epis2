#!/usr/bin/env node
/** MF-NORM-07 — clinical-calm escalera tonal + theme validate. */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const themeJson = readFileSync(
  join(root, 'packages/epis2-ui/src/theme/source/clinical-calm.material-theme.json'),
  'utf8',
);
const parsed = JSON.parse(themeJson);
const light = parsed.schemes?.light;
if (!light) errors.push('clinical-calm sin scheme light');
else {
  if (light.surfaceContainerLow !== '#F7F9FC') {
    errors.push('surfaceContainerLow debe ser #F7F9FC (canon NORM-07)');
  }
  if (light.primary !== '#0B5C66') {
    errors.push('primary clinical-calm debe ser #0B5C66');
  }
}

const themeValidate = spawnSync('npm', ['run', 'theme:validate'], {
  cwd: root,
  shell: true,
  stdio: 'inherit',
});
if (themeValidate.status !== 0) errors.push('theme:validate falló');

if (errors.length) {
  console.error('ficha-norm-theme-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ficha-norm-theme-gate OK — MF-NORM-07');
