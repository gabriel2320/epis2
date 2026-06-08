#!/usr/bin/env node
/** Meta-gate L3+L4+L5 — integración capas UX / RAD / clinical-productivity. */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const subGates = [
  'validate-ui-simplify-gate.mjs',
  'validate-rad-m3-discipline-gate.mjs',
  'validate-grid-surface-gate.mjs',
  'validate-form-collapse-gate.mjs',
  'validate-clinical-form-rhf-gate.mjs',
  'validate-form-screen-tree-gate.mjs',
  'validate-clinical-productivity-gate.mjs',
];

for (const script of subGates) {
  const r = spawnSync('node', [join(root, 'scripts/quality', script)], {
    cwd: root,
    encoding: 'utf8',
  });
  if (r.status !== 0) {
    errors.push(`${script} falló:\n${r.stdout ?? ''}${r.stderr ?? ''}`);
  }
}

const bridge = join(root, 'apps/web/src/components/rad/EpisRadSelectableGrid.tsx');
if (!existsSync(bridge)) {
  errors.push('Falta EpisRadSelectableGrid.tsx');
} else {
  const src = readFileSync(bridge, 'utf8');
  if (!src.includes('ClinicalDataGrid') && !src.includes('@epis2/clinical-productivity')) {
    errors.push('EpisRadSelectableGrid debe delegar en @epis2/clinical-productivity');
  }
}

const plan = join(root, 'docs/product/EPIS2_GLOBAL_DEV_PLAN.md');
if (!existsSync(plan)) {
  errors.push('Falta EPIS2_GLOBAL_DEV_PLAN.md');
} else {
  const planSrc = readFileSync(plan, 'utf8');
  if (!planSrc.includes('L5 clinical-productivity') && !planSrc.includes('clinical-productivity')) {
    errors.push('Plan global debe documentar capa L5 clinical-productivity');
  }
}

const dashboardTabs = [
  'IcuDashboardTab.tsx',
  'SpecialtyDashboardTab.tsx',
  'PatientDashboardTab.tsx',
  'QualityDashboardTab.tsx',
];
for (const file of dashboardTabs) {
  const full = join(root, 'apps/web/src/components', file);
  if (!existsSync(full)) {
    errors.push(`Falta ${file}`);
    continue;
  }
  const src = readFileSync(full, 'utf8');
  if (!src.includes('EpisRadDashboardTabShell')) {
    errors.push(`${file} debe usar EpisRadDashboardTabShell`);
  }
  if (src.includes('<ListItem')) {
    errors.push(`${file} aún usa listas card-like (<ListItem>)`);
  }
}

const registry = readFileSync(join(root, 'apps/web/src/design/radScreenRegistry.ts'), 'utf8');
for (const id of ['dashboard-icu', 'dashboard-specialty', 'dashboard-patient', 'dashboard-quality', 'dashboard-pharmacy']) {
  const entry = registry.match(new RegExp(`id: '${id}'[\\s\\S]*?migrationStatus: 'done'`));
  if (!entry) errors.push(`${id} debe estar migrationStatus done en registry`);
}

if (errors.length) {
  console.error('layers-integration-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('layers-integration-gate OK — L3 UX + L4 RAD + L5 clinical-productivity integrados');
