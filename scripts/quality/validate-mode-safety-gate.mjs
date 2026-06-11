#!/usr/bin/env node
/** PM01-E — seguridad de transición de modo (guards + borrador no guardado). */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const safetyPath = join(root, 'apps/web/src/modes/modeTransitionSafety.ts');
if (!existsSync(safetyPath)) {
  errors.push('Falta modes/modeTransitionSafety.ts (MF-THREE-MODES-03)');
} else {
  const safety = readFileSync(safetyPath, 'utf8');
  if (!safety.includes('registerUnsavedWorkProbe')) {
    errors.push('modeTransitionSafety debe registrar probes de trabajo sucio');
  }
  if (!safety.includes('hasUnsavedClinicalWork')) {
    errors.push('modeTransitionSafety debe exponer hasUnsavedClinicalWork');
  }
}

const switcherPath = join(root, 'apps/web/src/components/modes/EpisModeSwitcher.tsx');
const switcher = readFileSync(switcherPath, 'utf8');
if (!switcher.includes('hasUnsavedClinicalWork')) {
  errors.push('EpisModeSwitcher debe consultar hasUnsavedClinicalWork antes de cambiar modo');
}
if (!switcher.includes('epis2-mode-transition-unsaved-dialog')) {
  errors.push('EpisModeSwitcher debe mostrar diálogo de confirmación');
}

const universal = readFileSync(
  join(root, 'apps/web/src/components/command/EpisUniversalCommandBar.tsx'),
  'utf8',
);
if (
  !universal.includes('command-center') ||
  !universal.includes('classic-contextual') ||
  !universal.includes('clinical-chart') ||
  !universal.includes('census-search')
) {
  errors.push(
    'EpisUniversalCommandBar debe tener variantes por modo (incl. clinical-chart y census-search)',
  );
}
if (universal.includes('firmar') || universal.includes('approve')) {
  errors.push('Command bar no debe auto-firmar');
}

if (errors.length) {
  console.error('mode-safety-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('mode-safety-gate OK — PM01-E');
