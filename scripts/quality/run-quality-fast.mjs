#!/usr/bin/env node
/**
 * Loop rápido — cambios pequeños UI/docs/tests/componentes no críticos.
 *   npm run quality:fast
 */
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  classifyChangeScope,
  eslintChanged,
  getChangedPaths,
  inferVitestTargets,
  inferWorkspaces,
  printGitSummary,
  runNpm,
  scanChangedForSensitive,
  typecheckWorkspaces,
  vitestTouched,
} from './quality-loop-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');

console.log('EPIS2 quality:fast\n');
printGitSummary(root);

const changed = getChangedPaths(root);
const { codePaths, docOnly } = classifyChangeScope(changed);

if (changed.length === 0) {
  console.log('\n(i) Working tree limpio — gates mínimos de frontera.');
}

const sensitive = scanChangedForSensitive(root, changed);
if (sensitive.length) {
  console.error('\n✗ PHI/secrets en archivos tocados:');
  for (const f of sensitive) {
    console.error(`  [${f.severity}] ${f.file} — ${f.label}`);
  }
  process.exit(1);
}
console.log('▶ phi/secrets scan (changed) … OK');

const steps = [];

if (!docOnly && codePaths.length) {
  steps.push(() => eslintChanged(root, codePaths));
  steps.push(() => typecheckWorkspaces(root, inferWorkspaces(changed)));
  steps.push(() => vitestTouched(root, inferVitestTargets(root, changed)));
} else if (docOnly) {
  console.log('▶ eslint/typecheck/vitest … skip (solo docs/reportes)');
}

steps.push(() => runNpm(root, 'architecture:validate', 'architecture:validate'));

let failed = false;
for (const step of steps) {
  if (!step()) failed = true;
}

if (failed) {
  console.error('\nquality:fast FAILED');
  process.exit(1);
}

console.log('\nquality:fast OK');
console.log('Cierre sesión / pre-PR: npm run quality:clinical o npm run quality:full');
