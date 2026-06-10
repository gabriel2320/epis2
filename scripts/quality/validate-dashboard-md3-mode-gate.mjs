#!/usr/bin/env node
/** MF-DASHBOARD-MD3 — modo dashboard sin router paralelo ni home alternativo. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const shellPath = join(root, 'apps/web/src/components/dashboard-md3/EpisDashboardMd3Shell.tsx');
const contentPath = join(root, 'apps/web/src/dashboard/DashboardModeContent.tsx');
const hookPath = join(root, 'apps/web/src/modes/episModeRuntime.ts');
const modesIndexPath = join(root, 'apps/web/src/modes/index.ts');
const routerPath = join(root, 'apps/web/src/routes/router.tsx');
const docsPath = join(root, 'docs/design/EPIS2_DASHBOARD_MD3_MODE.md');

if (!existsSync(shellPath)) errors.push('Falta EpisDashboardMd3Shell.tsx');
if (!existsSync(hookPath)) errors.push('Falta modes/episModeRuntime.ts');
if (!existsSync(modesIndexPath)) errors.push('Falta modes/index.ts');
if (!existsSync(docsPath)) errors.push('Falta EPIS2_DASHBOARD_MD3_MODE.md');

const runtimeSrc = readFileSync(hookPath, 'utf8');
if (!runtimeSrc.includes('useDashboardMd3Mode')) {
  errors.push('episModeRuntime debe exportar useDashboardMd3Mode');
}

if (existsSync(join(root, 'apps/web/src/dashboard-md3/useDashboardMd3Mode.ts'))) {
  errors.push('Shim deprecated useDashboardMd3Mode.ts aún presente (MF-THREE-MODES-08)');
}

const shellSrc = readFileSync(shellPath, 'utf8');
if (!shellSrc.includes('100dvh')) errors.push('Shell dashboard debe usar 100dvh');
if (!shellSrc.includes('main-grid-only'))
  errors.push('Shell dashboard debe declarar scroll policy');

const contentSrc = readFileSync(contentPath, 'utf8');
if (!contentSrc.includes('useDashboardMd3Mode'))
  errors.push('DashboardModeContent debe bifurcar modo MD3');
if (!contentSrc.includes('DashboardMd3WorkspaceLayout'))
  errors.push('DashboardModeContent debe usar layout MD3');

const routerSrc = readFileSync(routerPath, 'utf8');
if (!routerSrc.includes("path: '/comando'")) errors.push('Home canónica /comando debe persistir');
if (routerSrc.match(/path:\s*'\/dashboard'/)) errors.push('No crear router paralelo /dashboard');

const topBar = readFileSync(
  join(root, 'apps/web/src/components/dashboard-md3/EpisDashboardMd3TopBar.tsx'),
  'utf8',
);
if (/label=\{copy\.[^}]*firmar|>\s*firmar\s*</i.test(topBar)) {
  errors.push('Top bar dashboard no debe ofrecer firmar/aprobar');
}

const visualDir = join(root, 'apps/web/src/components/dashboard-md3');
for (const file of [
  'EpisDashboardMd3TopBar.tsx',
  'EpisDashboardMd3ScopeBar.tsx',
  'EpisDashboardMd3NavigationRail.tsx',
  'EpisDashboardMd3KpiStrip.tsx',
  'EpisDashboardMd3MainGrid.tsx',
  'EpisDashboardMd3DetailPane.tsx',
  'EpisDashboardMd3CommandBar.tsx',
  'EpisDashboardMd3StatusBar.tsx',
]) {
  const src = readFileSync(join(visualDir, file), 'utf8');
  if (src.includes('../api/') || src.includes('../../api/')) {
    errors.push(`${file} no debe importar API directamente`);
  }
}

if (errors.length) {
  console.error('dashboard-md3-mode-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('dashboard-md3-mode-gate OK — MF-DASHBOARD-MD3');
