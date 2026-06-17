#!/usr/bin/env node
/** CICA Clean Room — /app no importa shell legacy. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const cicaDir = join(root, 'apps/web/src/cica');
const errors = [];

const forbidden = [
  ['ClinicalShellLayout', 'shell legacy'],
  ['EpisAppScaffold', 'scaffold administrativo'],
  ['EpisDashboardShell', 'dashboard shell'],
  ['LegacySidebar', 'sidebar legacy'],
  ['EpisModeSwitcher', 'Centro/Ficha/Dashboard'],
  ['ChartEspacioCommandDock', 'command dock legacy'],
  ['PatientListGrid', 'grid administrativo'],
  ['ClassicMd3WorkspaceLayout', 'workspace legacy'],
  ['DualChartPatientPage', 'ficha legacy embebida'],
];

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      const src = readFileSync(p, 'utf8');
      for (const [token, msg] of forbidden) {
        if (src.includes(token)) {
          errors.push(`${p.replace(root + '/', '')} importa ${token} — ${msg}`);
        }
      }
    }
  }
}

try {
  walk(cicaDir);
} catch {
  errors.push('Falta apps/web/src/cica/');
}

const layout = readFileSync(join(cicaDir, 'CicaAppLayout.tsx'), 'utf8');
if (!layout.includes('CicaAppShell')) {
  errors.push('CicaAppLayout debe usar CicaAppShell');
}

const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
if (!router.includes("id: 'cica-shell'")) {
  errors.push('router sin cica-shell layout');
}
if (!router.includes('CicaAppLayout')) {
  errors.push('router sin CicaAppLayout');
}

if (errors.length) {
  console.error('cica-no-legacy-shell-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('cica-no-legacy-shell-gate OK — /app sin imports shell legacy');
