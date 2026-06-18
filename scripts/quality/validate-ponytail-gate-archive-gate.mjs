#!/usr/bin/env node
/** MF-PONY-GATE-01 — gates design-agents / pony trim en archived PROG-PONYTAIL-TRIM. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { PONYTAIL_ARCHIVED_GATES, PONYTAIL_REMOVED_GATES } from '../../tools/gates/ponytail-gate-list.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const classify = readFileSync(join(root, 'tools/gates/gate-classify.mjs'), 'utf8');
if (!classify.includes('PROG-PONYTAIL-TRIM')) {
  errors.push('gate-classify.mjs sin PROG-PONYTAIL-TRIM');
}

if (!existsSync(join(root, 'tools/gates/apply-archive-ponytail-gate.mjs'))) {
  errors.push('falta tools/gates/apply-archive-ponytail-gate.mjs');
}

const catalog = JSON.parse(readFileSync(join(root, 'tools/gates/catalog-full.json'), 'utf8'));
const active = catalog.gates ?? {};
const archived = catalog.archived ?? {};

for (const gate of PONYTAIL_ARCHIVED_GATES) {
  if (active[gate]) errors.push(`${gate} aún en catalog.gates activos`);
  const entry = archived[gate];
  if (!entry) {
    errors.push(`${gate} falta en catalog.archived`);
    continue;
  }
  if (entry.archivedProgram !== 'PROG-PONYTAIL-TRIM') {
    errors.push(`${gate} archivedProgram=${entry.archivedProgram ?? '?'} (esperado PROG-PONYTAIL-TRIM)`);
  }
  if (entry.path && !existsSync(join(root, entry.path))) {
    errors.push(`${gate} script ausente: ${entry.path}`);
  }
}

for (const gate of PONYTAIL_REMOVED_GATES) {
  if (active[gate] || archived[gate]) {
    errors.push(`${gate} debe estar fuera del catálogo (gate eliminado KNIP-02-A)`);
  }
  const slug = gate.replace(/^quality:/, '').replace(/-gate$/, '');
  const legacyPath = join(root, `scripts/quality/validate-${slug}-gate.mjs`);
  if (existsSync(legacyPath)) {
    errors.push(`script huérfano ${legacyPath} (gate retirado)`);
  }
}

const keepActive = [
  'quality:rad-m3-discipline-gate',
  'quality:dual-chart-scaffold-gate',
  'quality:m3-scaffold-gate',
  'quality:classic-md3-ai-mode-gate',
];
for (const gate of keepActive) {
  if (!archived[gate] && !active[gate]) {
    errors.push(`${gate} debe permanecer en catálogo (scaffold/RAD activo)`);
  }
}

if (errors.length) {
  console.error('ponytail-gate-archive-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log(
  `ponytail-gate-archive-gate OK — PROG-PONYTAIL-TRIM gates=${PONYTAIL_ARCHIVED_GATES.length}`,
);
