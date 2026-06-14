#!/usr/bin/env node
/** MF-PAPER-07 — puente documentos A5/Carta desde ficha papel. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const bridgePath = join(root, 'apps/web/src/routes/paperDocumentBridge.ts');
const toolbarPath = join(root, 'apps/web/src/components/chart/PaperDocumentToolbar.tsx');
const navigatePath = join(root, 'apps/web/src/routes/clinicalNavigate.ts');

for (const [label, path] of [
  ['paperDocumentBridge', bridgePath],
  ['PaperDocumentToolbar', toolbarPath],
  ['clinicalNavigate', navigatePath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

if (existsSync(toolbarPath)) {
  const src = readFileSync(toolbarPath, 'utf8');
  for (const needle of [
    'epis2-paper-doc-bridge',
    'navigatePaperDocumentBridge',
    'PAPER_DOCUMENT_BRIDGES',
  ]) {
    if (!src.includes(needle)) errors.push(`PaperDocumentToolbar falta ${needle}`);
  }
}

if (existsSync(bridgePath)) {
  const src = readFileSync(bridgePath, 'utf8');
  for (const needle of [
    'discharge_summary',
    'returnChartMode',
    'navigateBackToPaperChart',
    'epis2-paper-bridge-prescription',
  ]) {
    if (!src.includes(needle)) errors.push(`paperDocumentBridge falta ${needle}`);
  }
}

const printPage = join(root, 'apps/web/src/pages/PrescriptionPrintPage.tsx');
if (existsSync(printPage)) {
  const src = readFileSync(printPage, 'utf8');
  if (!src.includes('epis2-paper-back-to-chart')) {
    errors.push('PrescriptionPrintPage falta retorno a ficha papel');
  }
}

if (errors.length) {
  console.error('paper-mode-doc-bridge-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('paper-mode-doc-bridge-gate OK — MF-PAPER-07 puente docs');
