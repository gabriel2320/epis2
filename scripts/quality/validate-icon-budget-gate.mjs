#!/usr/bin/env node
/** MF-UI-SIMPLIFY — presupuesto de iconos por tipo de pantalla. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const rules = readFileSync(join(root, 'apps/web/src/quality/uiDensityRules.ts'), 'utf8');
const hero = readFileSync(join(root, 'packages/epis2-ui/src/command/EpisCommandCenterHero.tsx'), 'utf8');
const inlineBar = readFileSync(
  join(root, 'packages/epis2-ui/src/command/EpisCommandCenterInlineBar.tsx'),
  'utf8',
);

for (const kind of ['command', 'workspace', 'form', 'document']) {
  if (!rules.includes(`${kind}:`)) errors.push(`EPIS_ICON_BUDGET sin ${kind}`);
}

if (hero.includes('EpisAssistChip') || hero.includes('AutoAwesomeIcon')) {
  errors.push('EpisCommandCenterHero: iconos decorativos en /comando');
}

if (inlineBar.includes('Bolt') || inlineBar.includes('AutoAwesome')) {
  errors.push('EpisCommandCenterInlineBar: iconos decorativos');
}

if (!rules.includes('EPIS_ICON_BUDGET')) {
  errors.push('uiDensityRules sin EPIS_ICON_BUDGET');
}

if (errors.length) {
  console.error('icon-budget-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('icon-budget-gate OK — presupuesto de iconos definido');
