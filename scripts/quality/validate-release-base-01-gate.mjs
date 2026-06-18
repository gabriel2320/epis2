#!/usr/bin/env node
/** MF-RELEASE-BASE-01 — prereqs tag epis2-base-v0.1 (PROG-PRODUCT-MAP cierre). */
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

/** @param {string} script */
function runGate(script) {
  const path = join(root, 'scripts/quality', script);
  const r = spawnSync(process.execPath, [path], { cwd: root, encoding: 'utf8' });
  if (r.status !== 0) {
    errors.push(`${script} falló:\n${(r.stdout ?? '').trim()}\n${(r.stderr ?? '').trim()}`.trim());
  }
}

const closeReport = join(root, 'reports/epis2-prog-product-map-close.md');
if (!existsSync(closeReport)) {
  errors.push('falta reports/epis2-prog-product-map-close.md');
}

for (const script of [
  'validate-product-map-gate.mjs',
  'validate-knip-05-a-gate.mjs',
  'validate-knip-05-b-gate.mjs',
  'validate-purge-doc-08-gate.mjs',
]) {
  runGate(script);
}

const currentState = readFileSync(join(root, 'docs/EPIS2_CURRENT_STATE.md'), 'utf8');
if (!/PROG-PRODUCT-MAP.*✓/.test(currentState)) {
  errors.push('EPIS2_CURRENT_STATE debe marcar PROG-PRODUCT-MAP ✓ cerrado');
}
if (!currentState.includes('epis2-base-v0.1')) {
  errors.push('EPIS2_CURRENT_STATE debe documentar tag epis2-base-v0.1');
}
if (!currentState.includes('/app/buscar')) {
  errors.push('EPIS2_CURRENT_STATE debe documentar entrada CICA /app/buscar');
}

const agentCtx = readFileSync(join(root, 'docs/AGENT_CONTEXT_MINIMAL.md'), 'utf8');
if (!agentCtx.includes('epis2-prog-product-map-close.md')) {
  errors.push('AGENT_CONTEXT_MINIMAL debe referenciar cierre PROG-PRODUCT-MAP');
}

if (existsSync(closeReport)) {
  const report = readFileSync(closeReport, 'utf8');
  for (const mf of [
    'MF-BRÚJULA-00',
    'MF-CATALOG-00',
    'MF-CATALOG-01',
    'MF-CATALOG-GATE-01',
    'MF-PURGE-DOC-08',
    'MF-KNIP-05-A',
    'MF-KNIP-05-B',
    'MF-RELEASE-BASE-01',
  ]) {
    if (!report.includes(mf)) errors.push(`close report sin ${mf}`);
  }
  for (const gate of ['quality:product-map-gate', 'quality:required']) {
    if (!report.includes(gate)) errors.push(`close report sin ${gate}`);
  }
}

if (errors.length) {
  console.error('release-base-01-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('release-base-01-gate OK — PROG-PRODUCT-MAP listo para tag epis2-base-v0.1');
