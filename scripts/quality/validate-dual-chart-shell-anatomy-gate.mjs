#!/usr/bin/env node
/** MF-DUAL-CHART-04 — Anatomía shell v2 (canon visual §2–5). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'docs/design/EPIS2_DUAL_CHART_VISUAL_CANON.md',
  'apps/web/src/components/chart/ClinicalInstitutionalHeader.tsx',
  'apps/web/src/components/chart/PatientIdentityBand.tsx',
  'apps/web/src/components/chart/ClinicalActionBar.tsx',
  'apps/web/src/components/chart/ClinicalFooterStatus.tsx',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const shell = join(root, 'apps/web/src/components/chart/ClinicalShell.tsx');
if (existsSync(shell)) {
  const src = readFileSync(shell, 'utf8');
  for (const token of [
    'ClinicalInstitutionalHeader',
    'PatientIdentityBand',
    'ClinicalActionBar',
    'ClinicalFooterStatus',
  ]) {
    if (!src.includes(token)) errors.push(`ClinicalShell.tsx debe componer ${token}`);
  }
}

const canon = readFileSync(
  join(root, 'docs/design/EPIS2_DUAL_CHART_VISUAL_CANON.md'),
  'utf8',
);
if (!canon.includes('PatientIdentityBand')) {
  errors.push('Canon visual debe documentar PatientIdentityBand');
}

if (errors.length) {
  console.error('dual-chart-shell-anatomy-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('dual-chart-shell-anatomy-gate OK — MF-DUAL-CHART-04 anatomía shell');
