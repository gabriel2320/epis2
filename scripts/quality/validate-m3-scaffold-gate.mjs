#!/usr/bin/env node
/** MF-UI-SIMPLIFY — scaffold M3 canónico presente y en uso. */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'apps/web/src/components/layout/EpisAppScaffold.tsx',
  'apps/web/src/components/layout/EpisClinicalWorkspaceShell.tsx',
  'apps/web/src/components/layout/EpisSplitWorkspace.tsx',
  'apps/web/src/components/actions/EpisClinicalActionBar.tsx',
  'apps/web/src/quality/uiDensityRules.ts',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const shell = readFileSync(join(root, 'apps/web/src/layouts/ClinicalShellLayout.tsx'), 'utf8');
const comando = readFileSync(join(root, 'apps/web/src/pages/CommandCenterPage.tsx'), 'utf8');
const dashboard = readFileSync(
  join(root, 'apps/web/src/dashboard/DashboardModeContent.tsx'),
  'utf8',
);
const ficha = readFileSync(join(root, 'apps/web/src/pages/PatientWorkspacePage.tsx'), 'utf8');
const appShell = readFileSync(
  join(root, 'packages/epis2-ui/src/clinical/EpisAppShellLayout.tsx'),
  'utf8',
);

if (!shell.includes('EpisAppScaffold'))
  errors.push('ClinicalShellLayout debe usar EpisAppScaffold');
if (!comando.includes('EpisAppScaffold'))
  errors.push('CommandCenterPage debe usar EpisAppScaffold');
if (!dashboard.includes('EpisClinicalWorkspaceShell')) {
  errors.push('DashboardModeContent debe usar EpisClinicalWorkspaceShell');
}
if (!ficha.includes('EpisClinicalWorkspaceShell')) {
  errors.push('PatientWorkspacePage debe usar EpisClinicalWorkspaceShell');
}
if (!appShell.includes('embeddedLayout')) {
  errors.push('EpisAppShellLayout debe soportar embeddedLayout (scroll único)');
}

if (errors.length) {
  console.error('m3-scaffold-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('m3-scaffold-gate OK — scaffold Material Design consolidado');
