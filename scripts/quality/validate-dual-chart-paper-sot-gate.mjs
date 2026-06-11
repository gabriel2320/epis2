#!/usr/bin/env node
/** MF-DUAL-CHART-02 — Modo papel SoT + impresión Carta/A5. */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const blueprintHints = [
  'packages/clinical-forms/src/paper-chart',
  'packages/clinical-forms/src/schemas/paper-chart',
];
const hasBlueprint = blueprintHints.some((rel) => existsSync(join(root, rel)));
if (!hasBlueprint) {
  errors.push(
    'Falta blueprint Zod paper-chart (packages/clinical-forms/src/paper-chart o schemas/paper-chart)',
  );
}

const router = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
if (!router.includes('/espacio/ficha/imprimir')) {
  errors.push('router.tsx sin ruta /espacio/ficha/imprimir');
}

function scanDirForToken(dir, token) {
  if (!existsSync(dir)) return false;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (scanDirForToken(full, token)) return true;
    } else if (entry.isFile() && /\.(ts|tsx|mjs)$/.test(entry.name)) {
      const src = readFileSync(full, 'utf8');
      if (src.includes(token)) return true;
    }
  }
  return false;
}

const apiRoot = join(root, 'apps/api/src');
if (
  !scanDirForToken(apiRoot, 'paperChart') &&
  !scanDirForToken(apiRoot, 'paper-chart')
) {
  errors.push('API sin handler borrador paper-chart (paperChart / paper-chart en apps/api/src)');
}

const template = readFileSync(
  join(root, 'apps/web/src/components/chart/paper/PaperChartTemplate.tsx'),
  'utf8',
);
if (!template.includes('onSectionChange') && !template.includes('onChange')) {
  errors.push('PaperChartTemplate.tsx debe exponer callback de persistencia por sección');
}

const printCss = readFileSync(
  join(root, 'apps/web/src/components/chart/paper/paperChartPrint.css'),
  'utf8',
);
if (!printCss.includes('@media print')) {
  errors.push('paperChartPrint.css sin @media print');
}

if (errors.length) {
  console.error('dual-chart-paper-sot-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('dual-chart-paper-sot-gate OK — MF-DUAL-CHART-02 papel SoT');
