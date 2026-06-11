#!/usr/bin/env node
/** MF-PAPER-01 — tokens marfil + CSS print grilla basal. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const colorsPath = join(root, 'packages/epis2-ui/src/theme/clinical/chart-modes-colors.ts');
const tokensPath = join(root, 'packages/epis2-ui/src/theme/chart-modes-tokens.ts');
const cssPath = join(root, 'apps/web/src/components/chart/paper/paperChartPrint.css');

if (!existsSync(colorsPath)) errors.push('Falta chart-modes-colors.ts');
if (!existsSync(tokensPath)) errors.push('Falta chart-modes-tokens.ts');
if (!existsSync(cssPath)) errors.push('Falta paperChartPrint.css');

if (existsSync(colorsPath)) {
  const colors = readFileSync(colorsPath, 'utf8');
  if (!colors.includes("paperBg: '#fdfcf7'")) {
    errors.push('paperBg debe ser #fdfcf7 (marfil FichaPapel)');
  }
  if (!colors.includes("ruledLine: '#d8d4cc'")) {
    errors.push('ruledLine debe usar gris pauta papel (#d8d4cc)');
  }
}

if (existsSync(tokensPath)) {
  const tokens = readFileSync(tokensPath, 'utf8');
  if (!tokens.includes('baselineMmLetter: 6')) {
    errors.push('epis2PaperChartTokens.baselineMmLetter = 6');
  }
  if (!tokens.includes('epis2PaperChartCssVars')) {
    errors.push('Falta helper epis2PaperChartCssVars');
  }
}

if (existsSync(cssPath)) {
  const css = readFileSync(cssPath, 'utf8');
  const requiredCss = [
    '@media print',
    '--epis2-paper-baseline',
    '.epis2-paper-page',
    'MuiAppBar-root',
    'epis2-clinical-institutional-header',
    '6mm',
  ];
  for (const needle of requiredCss) {
    if (!css.includes(needle)) errors.push(`paperChartPrint.css falta: ${needle}`);
  }
}

if (errors.length) {
  console.error('paper-mode-tokens-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('paper-mode-tokens-gate OK — MF-PAPER-01 tokens + print CSS');
