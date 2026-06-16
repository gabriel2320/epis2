#!/usr/bin/env node
/**
 * PROG-CONSOLIDATE — inventario read-only de gates (catálogo vs manifiestos vs scripts).
 *   node tools/gates/inventory-orphans.mjs
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadManifestWired } from './gate-classify.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const gatesDir = dirname(fileURLToPath(import.meta.url));
const outPath = join(root, 'reports/gates-inventory-2026-06.md');

const catalogDoc = JSON.parse(readFileSync(join(gatesDir, 'catalog-full.json'), 'utf8'));
const activeGates = catalogDoc.gates ?? {};
const archivedGates = catalogDoc.archived ?? {};
const allGates = { ...archivedGates, ...activeGates };
const catalogKeys = Object.keys(activeGates).sort();

const wiredFromManifests = loadManifestWired();

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const rootScripts = Object.keys(pkg.scripts ?? {})
  .filter((k) => k.startsWith('quality:'))
  .sort();

const diskScripts = readdirSync(join(root, 'scripts/quality'))
  .filter((f) => f.startsWith('validate-') && f.endsWith('-gate.mjs'))
  .map((f) => f.replace(/^validate-/, 'quality:').replace(/\.mjs$/, ''))
  .sort();

const catalogOnly = catalogKeys.filter((k) => !wiredFromManifests.has(k));
const wired = catalogKeys.filter((k) => wiredFromManifests.has(k));
const diskNotCatalog = diskScripts.filter((k) => !allGates[k]);
const catalogMissingDisk = catalogKeys.filter((k) => {
  const entry = activeGates[k];
  return entry?.type === 'file' && entry.path?.includes('validate-') && !diskScripts.includes(k);
});

const closedPrograms = [
  { program: 'PROG-STRENGTHEN', prefix: /^quality:sh-/ },
  { program: 'PROG-FICHA-FIRST', prefix: /^quality:(ficha-first|ficha-norm|login-command)/ },
  { program: 'PROG-THREE-MODES', prefix: /^quality:(three-modes|classic-md3|dashboard-md3|mode-)/ },
  { program: 'Tramos A–K', prefix: /^quality:tramo-/ },
  { program: 'Olas / TE / PA', prefix: /^quality:(ola|te-|pa-|cm-|m3-)/ },
];

function suggestAction(gate) {
  if (wiredFromManifests.has(gate)) return 'keep-wired';
  if (rootScripts.includes(gate)) return 'keep-root-shim';
  for (const { program, prefix } of closedPrograms) {
    if (prefix.test(gate)) return `archive-candidate (${program})`;
  }
  if (/^quality:(week|paper-planner|dual-chart-next|microphase)/.test(gate)) {
    return 'archive-candidate (histórico)';
  }
  return 'catalog-only — revisar';
}

const lines = [
  '# EPIS2 — Inventario gates (read-only)',
  '',
  `**Generado:** ${new Date().toISOString().slice(0, 10)} · **Comando:** \`node tools/gates/inventory-orphans.mjs\``,
  '',
  '## Resumen',
  '',
  '| Métrica | Valor |',
  '|---------|-------|',
  `| Entradas catálogo activo | ${catalogKeys.length} |`,
  `| Entradas archived | ${Object.keys(archivedGates).length} |`,
  `| Scripts validate-* en disco | ${diskScripts.length} |`,
  `| quality:* en package.json root | ${rootScripts.length} |`,
  `| Referenciados (manifiestos + close-gates) | ${wired.length} |`,
  `| Solo catálogo (no wired) | ${catalogOnly.length} |`,
  `| Disco sin catálogo | ${diskNotCatalog.length} |`,
  '',
  '## Gates wired (CI / manifiestos / close-gates)',
  '',
  ...wired.map((g) => `- \`${g}\``),
  '',
  '## Catálogo-only — candidatos a archivo (muestra acción sugerida)',
  '',
  '| Gate | Acción sugerida |',
  '|------|-----------------|',
  ...catalogOnly.map((g) => `| \`${g}\` | ${suggestAction(g)} |`),
  '',
];

if (diskNotCatalog.length) {
  lines.push('## Scripts en disco sin entrada catálogo', '', ...diskNotCatalog.map((g) => `- \`${g}\``), '');
}

if (catalogMissingDisk.length) {
  lines.push(
    '## Catálogo apunta a script faltante',
    '',
    ...catalogMissingDisk.map((g) => `- \`${g}\``),
    '',
  );
}

lines.push(
  '## Próximo paso (PR chore/gates-prune-phase1)',
  '',
  '1. Mover gates `archive-candidate` a sección `archived` en catálogo (no borrar `.mjs`).',
  '2. Mantener wired + gates de programas activos (AEST, ficha-first, paper standalone, e2e-transversal).',
  '3. Regenerar con `node tools/gates/inventory-orphans.mjs` tras poda.',
  '',
);

writeFileSync(outPath, lines.join('\n'));
console.log(`gates inventory written: ${outPath}`);
console.log(
  `  active=${catalogKeys.length} archived=${Object.keys(archivedGates).length} wired=${wired.length} catalog-only=${catalogOnly.length}`,
);
