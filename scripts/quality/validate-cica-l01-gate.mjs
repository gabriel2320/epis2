#!/usr/bin/env node
/** MF-CICA-L01 — buscar + censo system-workspace GO. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const activePath = join(root, 'reports/cica-l/cica-l-active.json');
const ledgerPath = join(root, 'reports/cica-l/01-censo-reform.md');
const closeReport = join(root, 'reports/epis2-mf-cica-l01-close.md');

let active = null;
try {
  active = JSON.parse(readFileSync(activePath, 'utf8'));
} catch {
  errors.push('falta reports/cica-l/cica-l-active.json');
}

if (active?.activeScreenId !== 'CICA-L-01') {
  errors.push(`activeScreenId debe ser CICA-L-01 (actual: ${active?.activeScreenId})`);
}

if (!existsSync(ledgerPath)) {
  errors.push('falta reports/cica-l/01-censo-reform.md');
} else {
  const ledger = readFileSync(ledgerPath, 'utf8');
  for (const section of ['## Fase A — Inventario', '## Fase C — Wireframe']) {
    if (!ledger.includes(section)) errors.push(`01-censo-reform.md sin ${section}`);
  }
  if (!ledger.includes('aprobado')) {
    errors.push('01-censo-reform.md sin wireframe aprobado');
  }
  if (!ledger.includes('100/100') && !ledger.includes('≥ 90')) {
    errors.push('01-censo-reform.md sin score ≥ 90 documentado');
  }
}

for (const file of [
  'apps/web/src/cica/CicaPatientSearchPage.tsx',
  'apps/web/src/cica/CicaCensusPage.tsx',
  'apps/web/src/cica/cicaSystemScreenAudit.ts',
  'apps/web/src/cica/cicaSystemScreenAudit.test.ts',
]) {
  if (!existsSync(join(root, file))) errors.push(`falta ${file}`);
}

const census = readFileSync(join(root, 'apps/web/src/cica/CicaCensusPage.tsx'), 'utf8');
if (!census.includes('copy.commandCenter.censusSubtitle')) {
  errors.push('CicaCensusPage debe usar copy.commandCenter.censusSubtitle');
}

const engine = readFileSync(
  join(root, 'packages/epis2-ui/src/layout/clinical/clinicalLayoutEngine.ts'),
  'utf8',
);
if (!engine.includes('systemWorkspace')) {
  errors.push('auditCicaScreen sin perfil systemWorkspace');
}

if (!existsSync(closeReport)) {
  errors.push('falta reports/epis2-mf-cica-l01-close.md');
}

const inventoryGate = join(root, 'scripts/quality/validate-cica-screen-inventory-gate.mjs');
if (errors.length === 0) {
  const child = spawnSync(process.execPath, [inventoryGate], { stdio: 'inherit' });
  if (child.status !== 0) process.exit(child.status ?? 1);
}

if (errors.length) {
  console.error('cica-l01-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('cica-l01-gate OK — CICA-L-01 buscar/censo system-workspace');
