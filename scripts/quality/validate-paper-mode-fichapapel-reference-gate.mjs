#!/usr/bin/env node
/** Referencia visual transversal FichaPapel — modo papel EPIS2. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const paths = {
  canon: join(root, 'docs/design/EPIS2_FICHAPAPEL_VISUAL_REFERENCE.md'),
  reference: join(root, 'packages/epis2-ui/src/theme/paper-visual-reference.ts'),
  fonts: join(root, 'apps/web/src/styles/epis2-fonts.css'),
  template: join(root, 'apps/web/src/components/chart/paper/PaperChartTemplate.tsx'),
  header: join(root, 'apps/web/src/components/chart/paper/PaperInstitutionalHeader.tsx'),
  strip: join(root, 'apps/web/src/components/chart/paper/PaperPatientStrip.tsx'),
  bridgeBtn: join(root, 'apps/web/src/components/chart/paper/PaperBridgeBackButton.tsx'),
  toolbar: join(root, 'apps/web/src/components/chart/PaperDocumentToolbar.tsx'),
  printCss: join(root, 'apps/web/src/components/chart/paper/paperChartPrint.css'),
};

for (const [label, path] of Object.entries(paths)) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

if (existsSync(paths.reference)) {
  const src = readFileSync(paths.reference, 'utf8');
  for (const needle of [
    'FICHAPAPEL_VISUAL_REFERENCE',
    'epis2PaperChromeBarSx',
    'epis2PaperSectionTitleSx',
    'epis2PaperFieldLabelSx',
    'github.com/gabriel2320/FichaPapel',
  ]) {
    if (!src.includes(needle)) errors.push(`paper-visual-reference.ts falta ${needle}`);
  }
}

if (existsSync(paths.template)) {
  const src = readFileSync(paths.template, 'utf8');
  for (const needle of ['PaperInstitutionalHeader', 'PaperPatientStrip', 'PaperFooter', 'PaperSectionChrome']) {
    if (!src.includes(needle)) errors.push(`PaperChartTemplate falta ${needle}`);
  }
}

if (existsSync(paths.toolbar)) {
  const src = readFileSync(paths.toolbar, 'utf8');
  if (!src.includes('epis2PaperChromeBarSx')) {
    errors.push('PaperDocumentToolbar debe usar epis2PaperChromeBarSx');
  }
}

if (existsSync(paths.printCss)) {
  const src = readFileSync(paths.printCss, 'utf8');
  for (const needle of ['Courier Prime', 'Source Sans 3', 'Libre Baskerville']) {
    if (!src.includes(needle)) errors.push(`paperChartPrint.css falta fuente ${needle}`);
  }
}

if (existsSync(paths.fonts)) {
  const src = readFileSync(paths.fonts, 'utf8');
  for (const needle of ['Libre+Baskerville', 'Source+Sans+3', 'Courier+Prime']) {
    if (!src.includes(needle)) errors.push(`epis2-fonts.css falta carga ${needle}`);
  }
}

if (errors.length) {
  console.error(
    'paper-mode-fichapapel-reference-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('paper-mode-fichapapel-reference-gate OK — referencia FichaPapel transversal');
