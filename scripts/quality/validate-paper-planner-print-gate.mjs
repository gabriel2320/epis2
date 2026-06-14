#!/usr/bin/env node
/** MF-PAPER-PLANNER-03 — print agenda + E2E. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'apps/web/src/pages/PaperPlannerPrintPage.tsx',
  'e2e/paper-planner-journey.spec.ts',
  'apps/web/src/components/chart/PaperChartMode.tsx',
]) {
  if (!existsSync(join(root, rel))) errors.push(`falta: ${rel}`);
}

const routerSrc = readFileSync(join(root, 'apps/web/src/routes/router.tsx'), 'utf8');
if (!routerSrc.includes('/espacio/ficha/agenda/imprimir')) {
  errors.push('router sin ruta agenda/imprimir');
}

const modeSrc = readFileSync(
  join(root, 'apps/web/src/components/chart/PaperChartMode.tsx'),
  'utf8',
);
if (!modeSrc.includes('/espacio/ficha/agenda/imprimir')) {
  errors.push('PaperChartMode sin navegación print agenda');
}

const cssSrc = readFileSync(
  join(root, 'apps/web/src/components/chart/paper/paperChartPrint.css'),
  'utf8',
);
if (!cssSrc.includes('epis2-paper-planner-month')) {
  errors.push('paperChartPrint.css sin reglas planner');
}

const e2e = readFileSync(join(root, 'e2e/paper-planner-journey.spec.ts'), 'utf8');
for (const token of [
  'epis2-paper-planner-month',
  'epis2-paper-planner-print-page',
  'ficha/agenda',
]) {
  if (!e2e.includes(token)) errors.push(`e2e planner sin ${token}`);
}

if (errors.length) {
  console.error('paper-planner-print-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('paper-planner-print-gate OK — MF-PAPER-PLANNER-03');
