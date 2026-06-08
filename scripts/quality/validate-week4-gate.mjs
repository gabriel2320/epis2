#!/usr/bin/env node
/** MF-DEV-WEEK4-CLOSURE — Orquestación SDK + evals closure + signoff A–J + Tramo K inventario. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const report = join(root, 'reports/epis2-dev-automation-week4-2026-06-07.md');
if (!existsSync(report)) errors.push('falta reporte week4');

for (const gate of [
  'validate-tramos-clinical-signoff-gate.mjs',
  'validate-tramo-closure-evals-gate.mjs',
  'validate-dev-agent-orchestration-gate.mjs',
  'validate-tramo-k-inventory-gate.mjs',
]) {
  if (!existsSync(join(root, 'scripts/quality', gate))) errors.push(`falta ${gate}`);
}

const pkg = readFileSync(join(root, 'package.json'), 'utf8');
for (const npm of [
  'quality:tramos-clinical-signoff-gate',
  'quality:tramo-closure-evals-gate',
  'quality:dev-agent-orchestration-gate',
  'quality:tramo-k-inventory-gate',
  'quality:week4-gate',
  'ai:evals:closure',
  'dev:agent:tramo-k',
  'dev:agent:orchestrate',
  'dev:agent:ollama',
  'dev:session',
  'dev:agent:close',
]) {
  if (!pkg.includes(`"${npm}"`)) errors.push(`package.json sin ${npm}`);
}

if (errors.length) {
  console.error('week4-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('week4-gate OK — Semana 4 orquestación avanzada cerrada');
