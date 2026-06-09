#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];
const bar = readFileSync(
  join(root, 'apps/web/src/components/command-center/EpisCommandCenterGoogleBar.tsx'),
  'utf8',
);
if (!bar.includes('epis2-command-google-bar')) errors.push('Falta google bar');
if (!bar.includes('CommandCenterClassicAccess')) errors.push('Hub debe conectar classic');
if (!bar.includes('CommandCenterDashboardAccess')) errors.push('Hub debe conectar dashboard');

if (errors.length) {
  console.error('command-center-hub-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('command-center-hub-gate OK');
