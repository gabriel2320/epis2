#!/usr/bin/env node
/**
 * MF-PURGE-01 — Archiva reportes cerrados a reports/archive/2026-06/ (lote 6).
 *   node scripts/maintenance/archive-reports-lote6.mjs [--dry-run]
 *
 * Mover, no borrar. Ver docs/product/EPIS2_PURGE_ARCHIVE_PLAN.md
 */
import { readdirSync, renameSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dryRun = process.argv.includes('--dry-run');
const archiveDir = join(root, 'reports/archive/2026-06');
const reportsDir = join(root, 'reports');

/** Nunca archivar */
const KEEP_EXACT = new Set([
  'README.md',
  'INDEX.md',
  'dev-agent-brief.md',
  'dev-agent-session.md',
  'dev-agent-ollama-plan.json',
]);

/** Prefijos/nombres que permanecen activos */
const KEEP_PATTERNS = [
  /^dev-agent-prompt-(?!tramo)/, // prompts activos, no tramo-*
  /^epis2-prog-.*-close/,
  /^epis2-situacion-actual-/,
  /^epis2-v0\.1-demo-rc/,
  /^epis2-cica-/,
  /^epis2-pr-aest-/,
  /^epis2-aesthetic-/,
  /^epis2-ux-lab-/,
  /^epis2-uxlab-/,
  /^epis2-audit-plan-post-rc3/,
  /^epis2-audit-estado-/,
  /^epis2-branch-protection-/,
  /^epis2-gates-inventory-/,
  /^epis2-m3-human-pilot-/,
  /^epis2-mf-con-/,
  /^epis2-session-close-2026-06-(1[5-9]|2)/,
  /^epis2-prog-release-hardening/,
  /^epis2-prog-consolidate/,
  /^epis2-prog-dev-parity/,
  /^epis2-prog-script-diet/,
  /^epis2-prog-agent-truth/,
  /^epis2-prog-demo-safety/,
  /^epis2-prog-core-labs/,
  /^epis2-prog-gobierno/,
  /^epis2-prog-legal/,
  /^epis2-prog-deps/,
  /^epis2-prog-security/,
  /^epis2-prog-post-rc3/,
  /^epis2-print-norm-documentation/,
];

/** Patrones explícitos para archivar (programas cerrados) */
const ARCHIVE_PATTERNS = [
  /^epis2-mf-(?!con-)/,
  /^epis2-mui-/,
  /^epis2-theme-/,
  /^epis2-layout-/,
  /^epis2-v[1-5]-/,
  /^epis2-ola/,
  /^epis2-plan-f/,
  /^epis2-three-modes-/,
  /^epis2-dashboard-md3-/,
  /^epis2-classic-md3-/,
  /^epis2-architecture-inventory-/,
  /^epis2-legacy-projects-audit/,
  /^epis2-learning-from-epis/,
  /^dev-agent-prompt-tramo-/,
  /^dual-chart-session-brief/,
  /^epis2-global-screen-form-audit/,
  /^epis2-idc-execution-matrix/,
  /^epis2-reconciled-navigation-tree/,
  /^epis2-wave-execution-canon/,
  /^epis2-chips-forms-completion/,
  /^epis2-widget-foundation/,
  /^epis2-monochrome-flat-theme/,
  /^epis2-visual-theme-aurora/,
  /^epis2-pilot-human-2026-06-05/,
  /^epis2-p0-drizzle-ci-session/,
  /^epis2-validation-gate/,
  /^theme-pipeline-latest/,
  /^epis2-ciclo-a-doc-sync/,
  /^epis2-p2-doc-sync-session/,
  /^epis2-ai-ext-inference/,
  /^epis2-material-theme-builder/,
  /^epis2-typography-aesthetics/,
  /^epis2-audit-tramo-e-/,
  /^epis2-session-handoff-consolidation/,
  /^epis2-consolidation-2-ci-close-plan/,
  /^epis2-session-close-2026-06-15-consolidation/,
  /^epis2-prog-ficha-first-close/,
  /^epis2-prog-strengthen-close/,
  /^epis2-prog-di-close/,
  /^epis2-prog-conciliacion/,
  /^epis2-prog-rapid-close/,
];

function shouldKeep(name) {
  if (KEEP_EXACT.has(name)) return true;
  return KEEP_PATTERNS.some((re) => re.test(name));
}

function shouldArchive(name) {
  if (!name.endsWith('.md')) return false;
  if (shouldKeep(name)) return false;
  return ARCHIVE_PATTERNS.some((re) => re.test(name));
}

if (!existsSync(archiveDir)) {
  mkdirSync(archiveDir, { recursive: true });
}

const files = readdirSync(reportsDir).filter((f) => f.endsWith('.md'));
const toMove = files.filter(shouldArchive);
const kept = files.filter((f) => !shouldArchive(f));

const manifest = {
  lote: 6,
  date: '2026-06-16',
  program: 'PROG-PURGE-CICA',
  mf: 'MF-PURGE-01',
  dryRun,
  moved: [],
  skippedAlreadyInArchive: [],
  keptCount: kept.length,
};

for (const file of toMove.sort()) {
  const src = join(reportsDir, file);
  const dest = join(archiveDir, file);
  if (existsSync(dest)) {
    manifest.skippedAlreadyInArchive.push(file);
    continue;
  }
  if (dryRun) {
    console.log(`[dry-run] would move: ${file}`);
  } else {
    renameSync(src, dest);
    console.log(`archived: ${file}`);
  }
  manifest.moved.push(file);
}

const manifestPath = join(archiveDir, 'lote6-manifest.json');
if (!dryRun) {
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
}

console.log(
  `\nLote 6 ${dryRun ? '(dry-run)' : ''}: ${manifest.moved.length} archivados, ${manifest.skippedAlreadyInArchive.length} ya en archive, ${kept.length} permanecen en raíz`,
);
