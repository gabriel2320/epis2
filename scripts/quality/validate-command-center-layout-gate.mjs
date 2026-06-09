#!/usr/bin/env node
/**
 * MF-UI-01 — /comando como pantalla de decisión (sin dashboard embebido).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const comando = readFileSync(join(root, 'apps/web/src/pages/CommandCenterPage.tsx'), 'utf8');
const hero = readFileSync(join(root, 'packages/epis2-ui/src/command/EpisCommandCenterHero.tsx'), 'utf8');
const chips = readFileSync(join(root, 'packages/command-registry/src/chips.ts'), 'utf8');

const forbiddenInComando = [
  ['EpisFloatingCommandDock', 'dock flotante en home'],
  ['CommandCenterMinimalBlocks', 'bento legacy en /comando'],
  ['EpisBentoGrid', 'grilla bento en /comando'],
  ['EpisCommandMetaChips', 'chips rol/IA duplicados bajo barra'],
  ['richCards', 'tarjetas grandes en producción'],
];

for (const [token, reason] of forbiddenInComando) {
  if (comando.includes(token)) {
    errors.push(`CommandCenterPage: ${reason} (${token})`);
  }
}

if (!comando.includes('railHidden')) {
  errors.push('CommandCenterPage debe ocultar rail en pantalla Tipo A (railHidden)');
}

if (!comando.includes('EpisCommandCenterGoogleBar')) {
  errors.push('CommandCenterPage debe usar EpisCommandCenterGoogleBar');
}

if (!comando.includes('reserveDockSpace={false}')) {
  errors.push('CommandCenterPage no debe reservar espacio de dock');
}

if (hero.includes('EpisAssistChip')) {
  errors.push('EpisCommandCenterHero: chips con iconos decorativos (EpisAssistChip)');
}

if (hero.includes('LockOutlinedIcon') || hero.includes('AutoAwesomeIcon')) {
  errors.push('EpisCommandCenterHero: iconos decorativos en notas de pie');
}

if (!chips.includes('COMMAND_CENTER_DENSITY')) {
  errors.push('command-registry sin presupuesto COMMAND_CENTER_DENSITY');
}

if (!chips.includes('maxCardChips: 0')) {
  errors.push('COMMAND_CENTER_DENSITY.maxCardChips debe ser 0 por defecto');
}

if (errors.length) {
  console.error('command-center-layout-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('command-center-layout-gate OK — /comando pantalla de decisión MF-UI-DENSITY');
