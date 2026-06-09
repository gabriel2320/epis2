#!/usr/bin/env node
/** MF-CLASSIC-EMR-MD3 — modo clásico sin router paralelo ni home alternativo. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const shellPath = join(root, 'apps/web/src/components/classic-md3/EpisClassicMd3Shell.tsx');
const layoutPath = join(root, 'apps/web/src/layouts/ClinicalShellLayout.tsx');
const routerPath = join(root, 'apps/web/src/routes/router.tsx');

if (!existsSync(shellPath)) errors.push('Falta EpisClassicMd3Shell.tsx');

const shellSrc = readFileSync(shellPath, 'utf8');
if (!shellSrc.includes('100dvh')) errors.push('Shell clásico debe usar 100dvh');
if (!shellSrc.includes('main-pane-only')) errors.push('Shell clásico debe declarar scroll policy');

const layoutSrc = readFileSync(layoutPath, 'utf8');
if (!layoutSrc.includes('useClassicMd3Mode')) {
  errors.push('ClinicalShellLayout debe bifurcar modo clásico');
}

const routerSrc = readFileSync(routerPath, 'utf8');
if (!routerSrc.includes("path: '/comando'")) errors.push('Home canónica /comando debe persistir');
if (routerSrc.match(/path:\s*'\/espacio\/classic'/)) {
  errors.push('No crear router paralelo /espacio/classic');
}

const prefsPath = join(root, 'apps/web/src/classic-md3/userPreferences.ts');
if (!existsSync(prefsPath)) errors.push('Falta userPreferences defaultPatientView');

const visualDir = join(root, 'apps/web/src/components/classic-md3');
for (const file of [
  'EpisClassicMd3TopAppBar.tsx',
  'EpisClassicMd3PatientHeader.tsx',
  'EpisClassicMd3MainPane.tsx',
  'EpisClassicMd3SupportingPane.tsx',
  'EpisClassicMd3ActionRail.tsx',
  'EpisClassicMd3CommandBar.tsx',
  'EpisClassicMd3StatusBar.tsx',
]) {
  const src = readFileSync(join(visualDir, file), 'utf8');
  if (src.includes('../api/') || src.includes('../../api/')) {
    errors.push(`${file} no debe importar API directamente`);
  }
}

if (errors.length) {
  console.error('classic-md3-mode-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('classic-md3-mode-gate OK — MF-CLASSIC-EMR-MD3');
