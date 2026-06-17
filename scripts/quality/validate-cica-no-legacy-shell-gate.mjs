#!/usr/bin/env node
/** CICA Clean Room — /app no importa shell ni widgets visuales legacy. */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const cicaDir = join(root, 'apps/web/src/cica');
const errors = [];

const PAPER_PAGE = 'CicaPaperDayPage.tsx';

const forbiddenTokens = [
  ['ClinicalShellLayout', 'shell legacy'],
  ['EpisAppScaffold', 'scaffold administrativo'],
  ['EpisDashboardShell', 'dashboard shell'],
  ['LegacySidebar', 'sidebar legacy'],
  ['EpisModeSwitcher', 'Centro/Ficha/Dashboard'],
  ['ChartEspacioCommandDock', 'command dock legacy'],
  ['PatientListGrid', 'grid administrativo'],
  ['ClassicMd3WorkspaceLayout', 'workspace legacy'],
  ['DualChartPatientPage', 'ficha legacy embebida'],
  ['PatientSearchResults', 'lista búsqueda legacy'],
];

const forbiddenImportPaths = [['../components/patient-search/', 'widget búsqueda legacy']];

function rel(p) {
  return relative(root, p).replace(/\\/g, '/');
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.tsx') || p.endsWith('.ts')) {
      const base = name;
      const src = readFileSync(p, 'utf8');
      const isPaperPage = base === PAPER_PAGE;

      for (const [token, msg] of forbiddenTokens) {
        if (src.includes(token)) {
          errors.push(`${rel(p)} importa ${token} — ${msg}`);
        }
      }

      if (!isPaperPage) {
        for (const [pathFragment, msg] of forbiddenImportPaths) {
          if (src.includes(pathFragment)) {
            errors.push(`${rel(p)} importa ${pathFragment} — ${msg}`);
          }
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

const layoutPath = join(cicaDir, 'CicaAppLayout.tsx');
const layout = readFileSync(layoutPath, 'utf8');
if (!layout.includes('CicaAppShell')) {
  errors.push('CicaAppLayout debe usar CicaAppShell');
}
if (!layout.includes('CicaSidebar')) {
  errors.push('CicaAppLayout debe usar CicaSidebar contextual');
}
if (layout.includes('/espacio/')) {
  errors.push('CicaAppLayout no debe enlazar rutas /espacio/*');
}
if (layout.includes('legacy-search') || layout.includes('cica-nav-more-legacy')) {
  errors.push('CicaAppLayout no debe exponer escape hatch legacy en nav');
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
