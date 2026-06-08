#!/usr/bin/env node
/** MF-UI-SIMPLIFY — copiar/pegar sin firma automática. */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const path = join(root, 'packages/clinical-productivity/src/components/ClinicalCopyPasteTools.tsx');
if (!existsSync(path)) errors.push('Falta ClinicalCopyPasteTools.tsx');

const src = readFileSync(path, 'utf8');
if (!src.includes('text/plain')) errors.push('CopyPaste debe limpiar formato (text/plain)');
if (!src.includes('fromAi')) errors.push('CopyPaste debe marcar origen IA');
if (!src.includes('createTextOrigin')) errors.push('CopyPaste debe registrar origen de texto');
if (src.includes('onSign') || src.includes('firmar')) {
  errors.push('CopyPaste no debe firmar automáticamente');
}

if (errors.length) {
  console.error('copy-paste-safety-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('copy-paste-safety-gate OK — copiar/pegar clínico seguro');
