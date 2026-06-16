#!/usr/bin/env node
/** CICA Clean Room — sin dashboard/modo tablero en /app. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const cicaDir = join(root, 'apps/web/src/cica');
const errors = [];

const forbiddenStrings = [
  ['Modo tablero', 'modo tablero visible'],
  ['DashboardShell', 'dashboard shell'],
  ['Centro/Ficha/Dashboard', 'tabs deprecados'],
  ['ClassicModeDeprecatedBanner', 'banner deprecado'],
  ['CentroFichaDashboardTabs', 'tabs legacy'],
  ['threeModes.dashboardLabel', 'label dashboard'],
  ['openDashboardMode', 'navegación dashboard'],
];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.tsx')) {
      const src = readFileSync(p, 'utf8');
      for (const [token, msg] of forbiddenStrings) {
        if (src.includes(token)) {
          errors.push(`${p.replace(root + '/', '')} contiene "${token}" — ${msg}`);
        }
      }
    }
  }
}

walk(cicaDir);

const policy = readFileSync(join(root, 'docs/design/EPIS2_CICA_CLEAN_ROOM_POLICY.md'), 'utf8');
if (!policy.includes('CICA Clean Room')) {
  errors.push('Falta docs/design/EPIS2_CICA_CLEAN_ROOM_POLICY.md');
}

if (errors.length) {
  console.error(
    'cica-no-dashboard-mode-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('cica-no-dashboard-mode-gate OK — /app sin dashboard ni modo tablero');
