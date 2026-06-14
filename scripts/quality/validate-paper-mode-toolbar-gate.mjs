#!/usr/bin/env node
/** MF-PAPER-05 — toolbar guardar/firmar/PDF conectado. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const paths = {
  toolbar: join(root, 'apps/web/src/components/chart/PaperDocumentToolbar.tsx'),
  mode: join(root, 'apps/web/src/components/chart/PaperChartMode.tsx'),
  printPage: join(root, 'apps/web/src/pages/PaperChartPrintPage.tsx'),
  api: join(root, 'apps/web/src/api/clinicalApi.ts'),
  server: join(root, 'apps/api/src/clinical/paperChart.ts'),
};

for (const [label, path] of Object.entries(paths)) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

if (existsSync(paths.toolbar)) {
  const src = readFileSync(paths.toolbar, 'utf8');
  for (const needle of ['epis2-paper-save', 'epis2-paper-sign', 'epis2-paper-pdf']) {
    if (!src.includes(needle)) errors.push(`PaperDocumentToolbar falta ${needle}`);
  }
}

if (existsSync(paths.mode)) {
  const src = readFileSync(paths.mode, 'utf8');
  for (const needle of ['handleSave', 'handleSign', 'signDraft', 'saveNow']) {
    if (!src.includes(needle)) errors.push(`PaperChartMode falta ${needle}`);
  }
}

if (existsSync(paths.api)) {
  const src = readFileSync(paths.api, 'utf8');
  for (const needle of ['approvePaperChartDraft', 'paper-chart/approve']) {
    if (!src.includes(needle)) errors.push(`clinicalApi falta ${needle}`);
  }
}

if (existsSync(paths.server)) {
  const src = readFileSync(paths.server, 'utf8');
  for (const needle of [
    'approvePaperChartDraft',
    'getPaperChartState',
    'PaperChartSignBlockedError',
  ]) {
    if (!src.includes(needle)) errors.push(`paperChart.ts falta ${needle}`);
  }
}

if (errors.length) {
  console.error('paper-mode-toolbar-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('paper-mode-toolbar-gate OK — MF-PAPER-05 toolbar + firma');
