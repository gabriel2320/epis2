#!/usr/bin/env node
/** MF-UI-SIMPLIFY — scroll único en layout raíz. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const scaffold = readFileSync(
  join(root, 'apps/web/src/components/layout/EpisAppScaffold.tsx'),
  'utf8',
);
const workspaceShell = readFileSync(
  join(root, 'apps/web/src/components/layout/EpisClinicalWorkspaceShell.tsx'),
  'utf8',
);
const appShell = readFileSync(
  join(root, 'packages/epis2-ui/src/clinical/EpisAppShellLayout.tsx'),
  'utf8',
);

if (!scaffold.includes('100dvh')) errors.push('EpisAppScaffold sin height 100dvh');
if (!scaffold.includes('epis2-main-content'))
  errors.push('EpisAppScaffold sin slot scroll principal');
if (!workspaceShell.includes("overflow: 'auto'") && !workspaceShell.includes('overflow: "auto"')) {
  errors.push('EpisClinicalWorkspaceShell sin scroll interno');
}
if (!appShell.includes('embeddedLayout')) {
  errors.push('EpisAppShellLayout sin modo embedded (evitar scroll doble)');
}

if (errors.length) {
  console.error('scroll-discipline-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('scroll-discipline-gate OK — scroll controlado');
