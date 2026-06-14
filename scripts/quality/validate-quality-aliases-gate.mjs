#!/usr/bin/env node
/** MF-FF-15 — aliases quality:ui y quality:ai. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const scripts = pkg.scripts ?? {};

if (!scripts['quality:ui']?.includes('quality:ui-simplify-gate')) {
  errors.push('quality:ui debe delegar en quality:ui-simplify-gate');
}
if (!scripts['quality:ai']?.includes('quality:sh-03-degrade-gate')) {
  errors.push('quality:ai debe incluir quality:sh-03-degrade-gate');
}
if (!scripts['quality:ai']?.includes('quality:ai-client-gate')) {
  errors.push('quality:ai debe incluir quality:ai-client-gate');
}
if (!scripts['quality:ai']?.includes('quality:web-ai-boundary-gate')) {
  errors.push('quality:ai debe incluir quality:web-ai-boundary-gate');
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
