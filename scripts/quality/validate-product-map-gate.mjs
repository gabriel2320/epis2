#!/usr/bin/env node
/** MF-CATALOG-GATE-01 — meta-gate PROG-PRODUCT-MAP (delega; no re-parse router). */
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

/** @param {string} script */
function runGate(script) {
  const path = join(root, 'scripts/quality', script);
  const r = spawnSync(process.execPath, [path], { cwd: root, encoding: 'utf8' });
  if (r.status !== 0) {
    errors.push(
      `${script} falló:\n${(r.stdout ?? '').trim()}\n${(r.stderr ?? '').trim()}`.trim(),
    );
  }
}

for (const script of [
  'validate-route-map-gate.mjs',
  'validate-product-catalog-minimum-gate.mjs',
  'validate-cica-clean-room-close-gate.mjs',
]) {
  runGate(script);
}

const currentState = readFileSync(join(root, 'docs/EPIS2_CURRENT_STATE.md'), 'utf8');
if (!/Versión:\*\* 1\.[4-9]/.test(currentState) && !/Versión:\*\* [2-9]\./.test(currentState)) {
  errors.push('EPIS2_CURRENT_STATE.md debe ser v1.4+ (brújula post-PONYTAIL)');
}
if (!currentState.includes('PROG-PRODUCT-MAP')) {
  errors.push('EPIS2_CURRENT_STATE.md debe documentar PROG-PRODUCT-MAP');
}
if (!currentState.includes('/app/buscar')) {
  errors.push('EPIS2_CURRENT_STATE.md debe documentar entrada CICA /app/buscar');
}

const agentCtx = readFileSync(join(root, 'docs/AGENT_CONTEXT_MINIMAL.md'), 'utf8');
for (const doc of ['EPIS2_ROUTE_MAP.md', 'EPIS2_PRODUCT_CATALOG.md']) {
  if (!agentCtx.includes(doc)) {
    errors.push(`AGENT_CONTEXT_MINIMAL.md debe referenciar ${doc}`);
  }
}

if (errors.length) {
  console.error('product-map-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('product-map-gate OK — route map + product catalog + CICA clean room');
