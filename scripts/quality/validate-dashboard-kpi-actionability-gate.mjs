#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const kpiSrc = readFileSync(
  join(root, 'apps/web/src/components/dashboard-md3/EpisDashboardMd3KpiStrip.tsx'),
  'utf8',
);
const contentSrc = readFileSync(join(root, 'apps/web/src/dashboard/DashboardModeContent.tsx'), 'utf8');
const errors = [];
if (!kpiSrc.includes('onClick')) errors.push('KPI strip debe ser accionable');
if (!kpiSrc.includes('data-epis-kpi-owner')) errors.push('KPI debe declarar owner');
if (!contentSrc.includes('workKpiItems')) errors.push('Dashboard debe definir KPIs de trabajo');
if (errors.length) {
  console.error('dashboard-kpi-actionability-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('dashboard-kpi-actionability-gate OK');
