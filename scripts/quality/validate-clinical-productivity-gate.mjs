#!/usr/bin/env node
/** MF-CLINICAL-PRODUCTIVITY-UTILS — meta-gate de utilidades clínicas. */
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const pkgIndex = join(root, 'packages/clinical-productivity/src/index.ts');
if (!existsSync(pkgIndex)) errors.push('Falta packages/clinical-productivity');

const indexSrc = readFileSync(pkgIndex, 'utf8');
for (const exportName of [
  'ClinicalAutocomplete',
  'ClinicalCommandPalette',
  'ClinicalDataGrid',
  'ClinicalBulkActionMenu',
  'ClinicalRichTextEditor',
  'ClinicalCopyPasteTools',
  'ClinicalTextBox',
]) {
  if (!indexSrc.includes(exportName)) errors.push(`index.ts no exporta ${exportName}`);
}

const forbiddenInScreens = [
  'cmdk',
  '@tiptap/',
  '@dnd-kit/',
  'meilisearch',
  'tesseract.js',
  'nspell',
  'languagetool',
];

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules') continue;
      walk(full, acc);
    } else if (/\.(tsx|ts)$/.test(entry)) {
      acc.push(full);
    }
  }
  return acc;
}

const webRoots = [
  join(root, 'apps/web/src/pages'),
  join(root, 'apps/web/src/components'),
].filter(existsSync);

for (const file of webRoots.flatMap((d) => walk(d))) {
  const rel = relative(root, file);
  const src = readFileSync(file, 'utf8');
  for (const lib of forbiddenInScreens) {
    if (src.includes(`from '${lib}`) || src.includes(`from "${lib}`)) {
      errors.push(`${rel} importa ${lib} directamente — usar @epis2/clinical-productivity`);
    }
  }
}

const subGates = [
  'validate-autocomplete-gate.mjs',
  'validate-spellcheck-gate.mjs',
  'validate-clinical-textbox-gate.mjs',
  'validate-clinical-textbox-assist-gate.mjs',
  'validate-clinical-spellcheck-gate.mjs',
  'validate-clinical-snippets-gate.mjs',
  'validate-clinical-ai-text-safety-gate.mjs',
  'validate-command-palette-gate.mjs',
  'validate-clinical-grid-gate.mjs',
  'validate-bulk-actions-gate.mjs',
  'validate-copy-paste-safety-gate.mjs',
  'validate-drag-drop-safety-gate.mjs',
  'validate-ollama-structured-output-gate.mjs',
];

for (const script of subGates) {
  const r = spawnSync('node', [join(root, 'scripts/quality', script)], {
    cwd: root,
    encoding: 'utf8',
  });
  if (r.status !== 0) {
    errors.push(`${script} falló:\n${r.stdout ?? ''}${r.stderr ?? ''}`);
  }
}

if (errors.length) {
  console.error('clinical-productivity-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('clinical-productivity-gate OK — MF-CLINICAL-PRODUCTIVITY-UTILS');
