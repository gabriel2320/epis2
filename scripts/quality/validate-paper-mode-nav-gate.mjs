#!/usr/bin/env node
/** MF-PAPER-04 — PaperSectionNavigator I–VII + scroll sección. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const navPath = join(root, 'apps/web/src/components/chart/paper/PaperSectionNavigator.tsx');
const modePath = join(root, 'apps/web/src/components/chart/PaperChartMode.tsx');

for (const [label, path] of [
  ['PaperSectionNavigator', navPath],
  ['PaperChartMode', modePath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

if (existsSync(navPath)) {
  const src = readFileSync(navPath, 'utf8');
  for (const needle of ['PAPER_CHART_SECTION_IDS', 'epis2-paper-nav-', 'paperNavTitle']) {
    if (!src.includes(needle)) errors.push(`PaperSectionNavigator falta ${needle}`);
  }
}

if (existsSync(modePath)) {
  const src = readFileSync(modePath, 'utf8');
  for (const needle of [
    'PaperSectionNavigator',
    'scrollToSection',
    'epis2-paper-section-',
    'section: sectionId',
    'resolvePaperSectionMinRows',
  ]) {
    if (!src.includes(needle)) errors.push(`PaperChartMode falta ${needle}`);
  }
}

const chromePath = join(root, 'apps/web/src/components/chart/paper/paperSectionChrome.tsx');
const scaffoldPath = join(root, 'apps/web/src/components/chart/paper/paperSectionScaffold.ts');
const batchPath = join(
  root,
  'packages/clinical-forms/src/paper-chart/paperSectionBatch.ts',
);

for (const [label, path] of [
  ['paperSectionChrome', chromePath],
  ['paperSectionScaffold', scaffoldPath],
  ['paperSectionBatch', batchPath],
]) {
  if (!existsSync(path)) errors.push(`Falta ${label}: ${path}`);
}

if (existsSync(chromePath)) {
  const src = readFileSync(chromePath, 'utf8');
  for (const section of [
    'nursing',
    'fluidBalance',
    'consults',
    'procedures',
    'imaging',
    'consent',
    'socialWork',
  ]) {
    if (!src.includes(`case '${section}':`)) {
      errors.push(`paperSectionChrome falta scaffold ${section}`);
    }
  }
}

if (existsSync(batchPath)) {
  const src = readFileSync(batchPath, 'utf8');
  if (!src.includes('PAPER_CHART_SECTIONS_VIII_XIV')) {
    errors.push('paperSectionBatch falta PAPER_CHART_SECTIONS_VIII_XIV');
  }
}

if (errors.length) {
  console.error('paper-mode-nav-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}

console.log('paper-mode-nav-gate OK — MF-PAPER-04 navigator I–XIV');
