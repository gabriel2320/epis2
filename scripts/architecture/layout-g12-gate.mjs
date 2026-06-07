#!/usr/bin/env node
/**
 * LAYOUT-G12 — no nested visual frames > 1 nivel en shell clínico.
 * Fase UX-A: baseline — isla interior prohibida en CommandCenterLayout.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '../..');

function runChecks() {
  const errors = [];
  const commandLayout = path.join(
    root,
    'packages/epis2-ui/src/clinical/EpisCommandCenterLayout.tsx',
  );
  const content = fs.readFileSync(commandLayout, 'utf8');
  if (content.includes('epis2IslandSx') || content.includes('epis2IslandPaddingSx')) {
    errors.push('EpisCommandCenterLayout no debe usar epis2IslandSx (LAYOUT-G12)');
  }

  const shellIsland = path.join(root, 'packages/epis2-ui/src/theme/island-layout.ts');
  const islandContent = fs.readFileSync(shellIsland, 'utf8');
  if (
    !islandContent.includes('epis2ShellContentIslandSx') ||
    !islandContent.includes('epis2ShellContentSx')
  ) {
    errors.push('falta alias epis2ShellContentSx plano para shell clínico');
  }

  const dashboardShell = path.join(
    root,
    'packages/epis2-ui/src/dashboard/EpisDashboardShell.tsx',
  );
  const dashboardContent = fs.readFileSync(dashboardShell, 'utf8');
  if (dashboardContent.includes('epis2IslandSx') || dashboardContent.includes('epis2IslandPaddingSx')) {
    errors.push('EpisDashboardShell no debe usar epis2IslandSx (LAYOUT-G12)');
  }
  if (dashboardContent.includes('epis2CanvasSx')) {
    errors.push('EpisDashboardShell no debe duplicar epis2CanvasSx — ya lo provee EpisAppShellLayout');
  }
  if (/border:\s*1[,}]/.test(dashboardContent)) {
    errors.push('EpisDashboardShell no debe usar cajas con border: 1 (UX-A.2 flatten)');
  }
  return errors;
}

export async function validate() {
  const errs = runChecks();
  if (errs.length) {
    return { ok: false, message: errs.join('; '), details: errs };
  }
  return {
    ok: true,
    message: 'Shell comando, tablero y contenido clínico sin isla anidada',
    details: [],
  };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) {
  const errs = runChecks();
  if (errs.length) {
    console.error('layout-g12-gate FAILED:\n' + errs.map((e) => `  - ${e}`).join('\n'));
    process.exit(1);
  }
  console.log('layout-g12-gate OK — shell comando, tablero y contenido clínico sin isla anidada');
}
