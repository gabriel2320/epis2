#!/usr/bin/env node
/**
 * PROG-PURGE-CICA — auditoría alineación archive + agent scope + reportes.
 *   node scripts/maintenance/audit-prog-purge-cica.mjs
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTableroState } from '../dev-agent/context.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const warnings = [];
const ok = [];

function check(name, pass, detail) {
  (pass ? ok : errors).push({ name, detail });
}

function warn(name, detail) {
  warnings.push({ name, detail });
}

// 1. Canon docs
for (const rel of [
  'docs/archive/AGENT_SCOPE_EXCLUSIONS.md',
  'docs/archive/ARCHIVED_PROGRAMS_INDEX.md',
  'docs/product/EPIS2_PURGE_ARCHIVE_PLAN.md',
  '.cursorignore',
  '.cursor/rules/05-agent-archive-boundary.mdc',
  'reports/archive/ARCHIVADO.md',
  'reports/archive/2026-06/lote6-manifest.json',
]) {
  check(`exists ${rel}`, existsSync(join(root, rel)), rel);
}

// 2. Report counts
const rootMd = readdirSync(join(root, 'reports')).filter((f) => f.endsWith('.md'));
const mfRoot = rootMd.filter((f) => f.startsWith('epis2-mf-') && !f.startsWith('epis2-mf-con-'));
check('reports raíz sin mf cerrados', mfRoot.length === 0, mfRoot.join(', ') || '0 mf históricos');
ok.push({
  name: 'reports raíz total',
  detail: `${rootMd.length} .md (+ reports/cica-l/)`,
});

if (existsSync(join(root, 'reports/archive/2026-06/lote6-manifest.json'))) {
  const manifest = JSON.parse(
    readFileSync(join(root, 'reports/archive/2026-06/lote6-manifest.json'), 'utf8'),
  );
  let dups = 0;
  for (const file of manifest.moved) {
    if (existsSync(join(root, 'reports', file))) dups++;
  }
  check('sin duplicados root/archive lote6', dups === 0, dups ? `${dups} duplicados` : '0');
}

// 3. Brújula vs tablero
const state = getTableroState(root);
check('brújula legible', Boolean(state.brujulaProgram), state.brujulaProgram ?? 'missing');
if (state.staleTableroHint) {
  warn('tablero header stale', state.staleTableroHint);
}
check(
  'activeThreads no vacío',
  state.activeThreads.length > 0,
  state.activeThreads.join(' · ') || 'vacío',
);

// 4. Archived subagent stubs
for (const id of ['layers-integrator', 'paper-mode']) {
  const p = join(root, `reports/dev-agent-prompt-${id}.md`);
  if (existsSync(p)) {
    const t = readFileSync(p, 'utf8');
    check(`stub ARCHIVADO ${id}`, t.includes('ARCHIVADO'), p);
  }
}

// 5. Sample gate paths (ficha-first uses archive)
const ffGate = readFileSync(join(root, 'scripts/quality/validate-ficha-first-gate.mjs'), 'utf8');
check(
  'ficha-first gate → archive',
  ffGate.includes('reports/archive/2026-06/epis2-mf-ff-'),
  'paths',
);

// 6. CURRENT_STATE mentions PURGE
const current = readFileSync(join(root, 'docs/EPIS2_CURRENT_STATE.md'), 'utf8');
check('CURRENT_STATE PROG-PURGE-CICA', current.includes('PROG-PURGE-CICA'), 'keyword');

console.log('EPIS2 audit PROG-PURGE-CICA\n');
console.log(`OK (${ok.length})`);
for (const { name, detail } of ok) console.log(`  ✓ ${name}: ${detail}`);
if (warnings.length) {
  console.log(`\nWARN (${warnings.length})`);
  for (const { name, detail } of warnings) console.log(`  ◐ ${name}: ${detail}`);
}
if (errors.length) {
  console.log(`\nFAIL (${errors.length})`);
  for (const { name, detail } of errors) console.log(`  ✗ ${name}: ${detail}`);
  process.exit(1);
}
console.log('\naudit OK');
