#!/usr/bin/env node
/** MF-UI-SIMPLIFY — drag & drop solo en modo edición reversible. */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const path = join(root, 'packages/clinical-productivity/src/components/ClinicalDraggableList.tsx');
if (!existsSync(path)) errors.push('Falta ClinicalDraggableList.tsx');

const src = readFileSync(path, 'utf8');
for (const token of ['editing', 'setEditing(false)', 'onReorder', '-handle']) {
  if (!src.includes(token)) errors.push(`ClinicalDraggableList sin ${token}`);
}

if (errors.length) {
  console.error('drag-drop-safety-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('drag-drop-safety-gate OK — DnD controlado');
