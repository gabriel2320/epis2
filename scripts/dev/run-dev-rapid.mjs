#!/usr/bin/env node
/**
 * MF-RAPID-03 — Loop dev rápido: quality:fast + auditor diff (opcional).
 *
 *   npm run dev:rapid
 *   npm run dev:rapid -- --skip-audit
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { classifyChangeScope, getChangedPaths } from '../quality/quality-loop-lib.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const skipAudit = process.argv.includes('--skip-audit');

function runNpmScript(script, extraArgs = []) {
  const r = spawnSync('npm', ['run', script, ...extraArgs], {
    cwd: root,
    shell: true,
    stdio: 'inherit',
  });
  return r.status === 0;
}

console.log('EPIS2 dev:rapid\n');

if (!runNpmScript('quality:fast')) {
  process.exit(1);
}

const changed = getChangedPaths(root);
const { codePaths, docOnly } = classifyChangeScope(changed);

if (skipAudit) {
  console.log('\n(i) --skip-audit — omitiendo dev:agent:audit-diff');
  console.log('\ndev:rapid OK');
  process.exit(0);
}

if (docOnly || codePaths.length === 0) {
  console.log('\n(i) Solo docs o tree limpio — omitiendo audit-diff');
  console.log('\ndev:rapid OK');
  process.exit(0);
}

console.log('\n▶ dev:agent:audit-diff\n');
const auditOk = runNpmScript('dev:agent:audit-diff');
if (!auditOk) {
  process.exit(1);
}

console.log('\ndev:rapid OK');
