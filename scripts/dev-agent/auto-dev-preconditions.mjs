#!/usr/bin/env node
/**
 * EPIS2-PM-03 — Verifica condiciones antes de autodesarrollo 6 h.
 *
 *   npm run dev:auto:preconditions
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadEnvFile } from '../load-env.mjs';
import { isEvolabPresent, resolveEvolabRoot } from './evolab-bridge.mjs';

loadEnvFile();

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const warnings = [];
const errors = [];

function ok(msg) {
  console.log(`  [OK] ${msg}`);
}

function warn(msg) {
  warnings.push(msg);
  console.log(`  [WARN] ${msg}`);
}

function fail(msg) {
  errors.push(msg);
  console.error(`  [FAIL] ${msg}`);
}

console.log('EPIS2 dev:auto:preconditions — PM-03\n');

if (process.env.EPIS2_AUTO_DEV_AUTHORIZED === '1') {
  ok('EPIS2_AUTO_DEV_AUTHORIZED=1 (commit/push permitidos)');
} else {
  warn('EPIS2_AUTO_DEV_AUTHORIZED no es 1 — commit/push bloqueados');
}

const ledgerPath = join(root, 'docs/quality/auto-dev-6h-ledger.json');
if (existsSync(ledgerPath)) {
  ok('Ledger auto-dev-6h presente');
} else {
  fail('Falta docs/quality/auto-dev-6h-ledger.json');
}

const ollamaUrl = process.env.OLLAMA_BASE_URL ?? 'http://127.0.0.1:11434';
const probe = spawnSync('npm', ['run', 'ollama:probe'], {
  cwd: root,
  stdio: 'pipe',
  shell: true,
  encoding: 'utf8',
});
if (probe.status === 0) {
  ok(`Ollama probe OK (${ollamaUrl})`);
} else {
  fail(`Ollama no disponible — ejecutar ollama serve o npm run stack:dev (${ollamaUrl})`);
}

if (process.env.CURSOR_API_KEY?.trim()) {
  ok('CURSOR_API_KEY definida — Cursor SDK habilitado');
} else if (process.env.EPIS2_AUTO_DEV_CURSOR_SDK === '0') {
  ok('Cursor SDK desactivado (EPIS2_AUTO_DEV_CURSOR_SDK=0)');
} else {
  warn('Sin CURSOR_API_KEY — tramos Tier X usarán cola reports/auto-dev-cursor-queue.jsonl');
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
for (const script of ['dev:auto:orchestrate', 'dev:auto:6h', 'dev:auto:preconditions']) {
  if (pkg.includes(`"${script}"`)) ok(`npm script ${script}`);
  else fail(`Falta npm script ${script}`);
}

const git = spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8', shell: true });
if (git.stdout?.trim()) {
  warn('Working tree con cambios sin commit — el orquestador puede mezclar commits por tramo');
} else {
  ok('Working tree limpio');
}

if (process.env.EPIS2_AUTO_DEV_EVOLAB === '1') {
  const evolabRoot = resolveEvolabRoot();
  if (isEvolabPresent(evolabRoot)) {
    ok(`Evolab presente (${evolabRoot})`);
    const doctor = spawnSync('npm', ['run', 'evolab:doctor'], {
      cwd: root,
      stdio: 'pipe',
      shell: true,
      encoding: 'utf8',
      env: { ...process.env, EPIS2_EVOLAB_ROOT: evolabRoot, EPIS2_ROOT: root },
    });
    if (doctor.status === 0) ok('evolab:doctor OK');
    else fail(`evolab:doctor falló — revisar clone en ${evolabRoot}`);
  } else {
    fail(`EPIS2_AUTO_DEV_EVOLAB=1 pero Evolab no encontrado en ${evolabRoot}`);
  }
} else {
  ok('Evolab desactivado (EPIS2_AUTO_DEV_EVOLAB≠1)');
}

console.log('');
if (errors.length) {
  console.error(`preconditions FAILED (${errors.length} error(es), ${warnings.length} aviso(s))`);
  process.exit(1);
}
console.log(`preconditions OK — ${warnings.length} aviso(s)`);
if (warnings.length) {
  for (const w of warnings) console.log(`  · ${w}`);
}
