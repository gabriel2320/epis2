#!/usr/bin/env node
/** MF-FF-15 — aliases quality:ui y quality:ai. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const scripts = pkg.scripts ?? {};
const catalog = JSON.parse(readFileSync(join(root, 'tools/gates/catalog-full.json'), 'utf8'));
const catalogGates = catalog.gates ?? {};

if (scripts['quality:ui'] || scripts['quality:ai']) {
  errors.push('package.json root no debe definir quality:ui/quality:ai (usar catalog-full.json)');
}

const uiCmd = catalogGates['quality:ui']?.command ?? '';
if (!uiCmd.includes('quality:ui-simplify-gate')) {
  errors.push('catalog quality:ui debe delegar en quality:ui-simplify-gate');
}
const aiCmd = catalogGates['quality:ai']?.command ?? '';
if (!aiCmd.includes('quality:sh-03-degrade-gate')) {
  errors.push('catalog quality:ai debe incluir quality:sh-03-degrade-gate');
}
if (!aiCmd.includes('quality:ai-client-gate')) {
  errors.push('catalog quality:ai debe incluir quality:ai-client-gate');
}
if (!aiCmd.includes('quality:web-ai-boundary-gate')) {
  errors.push('catalog quality:ai debe incluir quality:web-ai-boundary-gate');
}

const velocity = readFileSync(join(root, 'docs/dev/EPIS2_DEV_VELOCITY.md'), 'utf8');
if (!velocity.includes('quality:ui') || !velocity.includes('quality:ai')) {
  errors.push('EPIS2_DEV_VELOCITY.md debe documentar quality:ui y quality:ai');
}

if (errors.length) {
  console.error('quality-aliases-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('quality-aliases-gate OK — MF-FF-15');
