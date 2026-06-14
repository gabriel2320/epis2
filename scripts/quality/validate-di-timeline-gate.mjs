#!/usr/bin/env node
/** MF-DI-08 — Timeline clínico filtrable. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'apps/api/src/clinical/timelineClinical.ts',
  'apps/api/src/clinical/timelineClinical.test.ts',
  'apps/web/src/components/chart/timeline/clinicalTimeline.ts',
  'apps/web/src/components/chart/timeline/ClinicalFilterableTimeline.tsx',
  'apps/web/src/components/chart/sections/TraditionalEvolutionSection.tsx',
  'apps/web/src/pages/DualChartPatientPage.tsx',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const apiTimeline = readFileSync(join(root, 'apps/api/src/clinical/timelineClinical.ts'), 'utf8');
for (const token of ['hospitalizations', 'evolutions', 'groupClinicalTimelineByPeriod']) {
  if (!apiTimeline.includes(token)) errors.push(`timelineClinical.ts sin ${token}`);
}

const evolution = readFileSync(
  join(root, 'apps/web/src/components/chart/sections/TraditionalEvolutionSection.tsx'),
  'utf8',
);
if (!evolution.includes('ClinicalFilterableTimeline')) {
  errors.push('TraditionalEvolutionSection debe usar ClinicalFilterableTimeline');
}

const dual = readFileSync(join(root, 'apps/web/src/pages/DualChartPatientPage.tsx'), 'utf8');
if (!dual.includes('focusTraditionalSection')) {
  errors.push('DualChartPatientPage debe enfocar sección evolución al ver timeline');
}

const e2e = readFileSync(join(root, 'e2e/dual-chart-modes.spec.ts'), 'utf8');
if (!e2e.includes('epis2-clinical-filterable-timeline')) {
  errors.push('e2e/dual-chart-modes.spec.ts debe verificar timeline filtrable');
}

const suites = [
  'apps/api/src/clinical/timelineClinical.test.ts',
  'apps/web/src/components/chart/timeline/clinicalTimeline.test.ts',
  'apps/web/src/components/chart/timeline/ClinicalFilterableTimeline.test.tsx',
];

for (const suite of suites) {
  const run = spawnSync('npx', ['vitest', 'run', '--run', suite], {
    cwd: root,
    shell: true,
    encoding: 'utf8',
  });
  if (run.status !== 0) errors.push(`${suite} falló`);
}

if (errors.length) {
  console.error('quality:di-timeline-gate — FALLO');
  for (const e of errors) console.error(`  · ${e}`);
  process.exit(1);
}

console.log('quality:di-timeline-gate — OK (MF-DI-08)');
