#!/usr/bin/env node
/** SIGNOFF-EXPERIENCIA-CORE — tres frentes A/B/C (PA-08 + TE-08 + CM-08). */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const ledger = JSON.parse(
  readFileSync(join(root, 'docs/quality/tres-frentes-ledger.json'), 'utf8'),
);

for (const id of ['MF-PA-08', 'MF-TE-08', 'MF-CM-08']) {
  const mf = ledger.phases?.find((m) => m.id === id);
  if (!mf) {
    errors.push(`ledger sin ${id}`);
    continue;
  }
  if (mf.state !== 'DONE') {
    errors.push(`${id} debe estar DONE (actual: ${mf.state})`);
  }
}

const SIGNOFF_GATES = [
  'validate-paper-mode-signoff-gate.mjs',
  'validate-te-08-signoff-gate.mjs',
  'validate-cm-08-signoff-gate.mjs',
];

for (const script of SIGNOFF_GATES) {
  const path = join(root, 'scripts/quality', script);
  try {
    readFileSync(path);
  } catch {
    errors.push(`falta gate ${script}`);
    continue;
  }
  const result = spawnSync(process.execPath, [path], {
    stdio: 'pipe',
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    errors.push(`${script} falló`);
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
  }
}

if (errors.length) {
  console.error(
    'experiencia-core-signoff-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}
console.log('experiencia-core-signoff-gate OK — SIGNOFF-EXPERIENCIA-CORE');
console.log('Desbloquea: PROG-STRENGTHEN-2026 · backlog PROG-CHILE');
