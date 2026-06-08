#!/usr/bin/env node
/** MF-UI-SIMPLIFY — supporting pane opcional sin ActionBar duplicada. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const split = readFileSync(join(root, 'apps/web/src/components/layout/EpisSplitWorkspace.tsx'), 'utf8');
const ficha = readFileSync(join(root, 'apps/web/src/pages/PatientWorkspacePage.tsx'), 'utf8');
const episSplit = readFileSync(join(root, 'packages/epis2-ui/src/layout/EpisSplitPane.tsx'), 'utf8');

if (!split.includes('localStorage')) errors.push('EpisSplitWorkspace sin persistencia local');
if (!split.includes('EpisSplitPane')) errors.push('EpisSplitWorkspace debe delegar en EpisSplitPane');
if (!ficha.includes('EpisSplitWorkspace')) errors.push('PatientWorkspacePage debe usar EpisSplitWorkspace');
if (split.includes('EpisClinicalActionBar') || split.includes('EpisClinicalFormActionBar')) {
  errors.push('Panel secundario no debe incluir ActionBar global');
}
if (!episSplit.includes('secondaryOpen')) {
  errors.push('EpisSplitPane sin secondaryOpen');
}

if (errors.length) {
  console.error('split-pane-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('split-pane-gate OK — pantalla doble opcional');
