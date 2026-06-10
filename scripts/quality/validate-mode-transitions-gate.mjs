#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const transitions = readFileSync(join(root, 'apps/web/src/modes/modeTransitions.ts'), 'utf8');
const session = readFileSync(join(root, 'apps/web/src/session/EpisSessionContext.tsx'), 'utf8');

for (const fn of [
  'transitionCommandToClassic',
  'transitionCommandToDashboard',
  'transitionDashboardToClassic',
  'transitionClassicToDashboard',
  'transitionClassicToCommand',
  'transitionDashboardToCommand',
]) {
  if (!transitions.includes(fn)) errors.push(`Falta ${fn}`);
}
if (!session.includes('openCommandCenter'))
  errors.push('EpisSessionContext debe exponer openCommandCenter');
if (!session.includes('openClassicMode'))
  errors.push('EpisSessionContext debe exponer openClassicMode');
if (!session.includes('openDashboardMode'))
  errors.push('EpisSessionContext debe exponer openDashboardMode');

if (errors.length) {
  console.error('mode-transitions-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('mode-transitions-gate OK');
