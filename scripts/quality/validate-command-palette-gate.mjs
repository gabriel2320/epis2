#!/usr/bin/env node
/** MF-CLINICAL-PRODUCTIVITY — command palette refuerza /comando. */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const path = join(root, 'packages/clinical-productivity/src/components/ClinicalCommandPalette.tsx');
if (!existsSync(path)) errors.push('Falta ClinicalCommandPalette.tsx');

const src = readFileSync(path, 'utf8');
if (!src.includes('useClinicalCommandPaletteShortcut')) {
  errors.push('Falta hook Ctrl+K useClinicalCommandPaletteShortcut');
}
if (!src.includes('requiresConfirmation')) {
  errors.push('Command palette debe soportar confirmación en acciones riesgosas');
}
if (!src.includes('maxVisible')) {
  errors.push('Command palette debe limitar sugerencias visibles');
}

const shellLayout = join(root, 'apps/web/src/layouts/ClinicalShellLayout.tsx');
if (existsSync(shellLayout)) {
  const shellSrc = readFileSync(shellLayout, 'utf8');
  if (!shellSrc.includes('ClinicalShellCommandPalette')) {
    errors.push('ClinicalShellLayout debe montar ClinicalShellCommandPalette (Ctrl+K global)');
  }
}

const paletteLayer = join(root, 'apps/web/src/components/ClinicalShellCommandPalette.tsx');
if (!existsSync(paletteLayer)) {
  errors.push('Falta ClinicalShellCommandPalette.tsx');
} else {
  const layerSrc = readFileSync(paletteLayer, 'utf8');
  if (!layerSrc.includes('maxVisible')) {
    errors.push('ClinicalShellCommandPalette debe pasar maxVisible a ClinicalCommandPalette');
  }
}

const commandPage = join(root, 'apps/web/src/pages/CommandCenterPage.tsx');
if (existsSync(commandPage)) {
  const pageSrc = readFileSync(commandPage, 'utf8');
  if (pageSrc.includes('ClinicalCommandPalette') && !pageSrc.includes('maxVisible')) {
    /* opcional en home — no fallar si aún no cableado */
  }
}

if (errors.length) {
  console.error('command-palette-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('command-palette-gate OK — paleta de comandos MD3');
