#!/usr/bin/env node
/** MF-PAPER-02 — campos papel nativos sin EpisTextField en template. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const required = [
  'apps/web/src/components/chart/paper/fields/PaperTextarea.tsx',
  'apps/web/src/components/chart/paper/fields/PaperFieldRow.tsx',
  'apps/web/src/components/chart/paper/fields/PaperSection.tsx',
  'apps/web/src/components/chart/paper/fields/PaperSubSection.tsx',
  'apps/web/src/components/chart/paper/fields/PaperTable.tsx',
  'apps/web/src/components/chart/paper/fields/PaperRuleBlock.tsx',
  'apps/web/src/components/chart/paper/fields/PaperSignatureBlock.tsx',
  'apps/web/src/components/chart/paper/paperSectionChrome.tsx',
];

for (const rel of required) {
  if (!existsSync(join(root, rel))) errors.push(`Falta ${rel}`);
}

const templatePath = join(root, 'apps/web/src/components/chart/paper/PaperChartTemplate.tsx');
if (existsSync(templatePath)) {
  const src = readFileSync(templatePath, 'utf8');
  if (src.includes('EpisTextField')) {
    errors.push('PaperChartTemplate no debe importar EpisTextField');
  }
  if (!src.includes('PaperTextarea')) {
    errors.push('PaperChartTemplate debe usar PaperTextarea');
  }
  if (!src.includes('PaperSection')) {
    errors.push('PaperChartTemplate debe usar PaperSection');
  }
  if (!src.includes('PaperSectionChrome')) {
    errors.push('PaperChartTemplate debe usar PaperSectionChrome');
  }
}

if (errors.length) {
  console.error('paper-mode-fields-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('paper-mode-fields-gate OK — MF-PAPER-02 campos papel nativos');
