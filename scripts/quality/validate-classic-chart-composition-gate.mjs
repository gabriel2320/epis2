#!/usr/bin/env node
/** MF-AEST-02 — ficha clásica tabulada (no rail de 17 ítems como entrada principal). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

for (const rel of [
  'apps/web/src/components/chart/ClassicChartTabs.tsx',
  'apps/web/src/components/chart/classicChartTabConfig.ts',
]) {
  try {
    readFileSync(join(root, rel), 'utf8');
  } catch {
    errors.push(`Falta ${rel}`);
  }
}

const traditional = readFileSync(
  join(root, 'apps/web/src/components/chart/TraditionalEhrMode.tsx'),
  'utf8',
);
if (!traditional.includes('ClassicChartTabs')) {
  errors.push('TraditionalEhrMode debe usar ClassicChartTabs');
}
if (!traditional.includes('classic-chart-tabs')) {
  errors.push('TraditionalEhrMode sin testId classic-chart-tabs');
}
if (/<TraditionalSectionNav[\s/>]/.test(traditional)) {
  errors.push('TraditionalEhrMode no debe usar rail lateral TraditionalSectionNav (MF-AEST-02)');
}
if (/<TraditionalSectionMobileNav[\s/>]/.test(traditional)) {
  errors.push('TraditionalEhrMode no debe usar selector mobile legacy como nav principal');
}

const copy = readFileSync(join(root, 'packages/design-system/src/copy/es.ts'), 'utf8');
if (!copy.includes('classicTabs')) {
  errors.push('copy/es.ts sin chartModes.classicTabs');
}
if (!copy.includes("more: 'Más'")) {
  errors.push('copy/es.ts sin chartModes.classicTabs.more (MF-AEST-02b)');
}

const config = readFileSync(
  join(root, 'apps/web/src/components/chart/classicChartTabConfig.ts'),
  'utf8',
);
if (!config.includes("'more'")) {
  errors.push('classicChartTabConfig sin tab Más (MF-AEST-02b)');
}

if (errors.length) {
  console.error(
    'classic-chart-composition-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('classic-chart-composition-gate OK — MF-AEST-02 tabs clínicos');
