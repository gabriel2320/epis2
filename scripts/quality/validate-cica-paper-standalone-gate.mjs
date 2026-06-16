#!/usr/bin/env node
/** CICA Clean Room — modo papel standalone en /app. */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const paper = readFileSync(join(root, 'apps/web/src/cica/CicaPaperDayPage.tsx'), 'utf8');

for (const token of [
  'PaperModeScreen',
  'PaperModeToolbar',
  'PaperCanvas',
  'cica-paper-back-chart',
  'cica-paper-day-screen',
  'data-cica-paper-standalone',
]) {
  if (!paper.includes(token.replace('data-', '')) && token.startsWith('data-')) {
    if (!paper.includes('PaperModeScreen')) {
      /* PaperModeScreen sets data-cica-paper-standalone on component */
    }
  }
}

if (!paper.includes('PaperModeScreen')) {
  errors.push('CicaPaperDayPage debe usar PaperModeScreen');
}
if (!paper.includes('PaperCanvas')) {
  errors.push('CicaPaperDayPage debe usar PaperCanvas');
}
if (!paper.includes('cica-paper-back-chart')) {
  errors.push('Falta retorno a ficha');
}
if (paper.includes('ClinicalShellLayout') || paper.includes('ClinicalPageNav')) {
  errors.push('Papel CICA no debe usar shell/page nav legacy');
}

const paperComponent = readFileSync(
  join(root, 'packages/epis2-ui/src/cica/PaperModeScreen.tsx'),
  'utf8',
);
if (!paperComponent.includes('data-cica-paper-standalone')) {
  errors.push('PaperModeScreen sin marker data-cica-paper-standalone');
}

if (errors.length) {
  console.error(
    'cica-paper-standalone-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('cica-paper-standalone-gate OK — papel /app standalone');
