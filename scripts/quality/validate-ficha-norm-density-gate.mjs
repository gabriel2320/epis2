#!/usr/bin/env node
/** MF-NORM-04 — radius traditional ≤10px en ficha dual + perfiles shape. */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const shapePath = join(root, 'packages/epis2-ui/src/theme/shape.ts');
const shapeSrc = readFileSync(shapePath, 'utf8');
if (!shapeSrc.includes('epis2TraditionalShapeMaxPx = 10')) {
  errors.push('shape.ts debe fijar epis2TraditionalShapeMaxPx = 10');
}
if (!shapeSrc.includes('clampTraditionalRadiusPx')) {
  errors.push('shape.ts debe exportar clampTraditionalRadiusPx');
}

const stickyPath = join(
  root,
  'apps/web/src/components/clinical-summary/ClinicalSummaryStickyBanner.tsx',
);
const stickySrc = readFileSync(stickyPath, 'utf8');
if (stickySrc.includes('borderRadius: `${20}px`') || stickySrc.includes('borderRadius: 20')) {
  errors.push('ClinicalSummaryStickyBanner no debe hardcodear radius 20px');
}
if (!stickySrc.includes('epis2ShapeProfiles')) {
  errors.push('ClinicalSummaryStickyBanner debe usar epis2ShapeProfiles por surface');
}

const cardPath = join(root, 'apps/web/src/components/clinical-summary/EpisClinicalSummaryCard.tsx');
const cardSrc = readFileSync(cardPath, 'utf8');
if (!cardSrc.includes('epis2ShapeProfiles')) {
  errors.push('EpisClinicalSummaryCard debe usar epis2ShapeProfiles');
}

/** Hardcoded radius >10 en chart/ (excluye círculos 50%). */
const forbiddenRadius = /\bborderRadius:\s*(['"`]?)(1[1-9]|[2-9]\d|\$\{?(1[1-9]|[2-9]\d))/;

function walkChart(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkChart(full);
    else if (/\.(tsx|ts)$/.test(name)) {
      const rel = relative(root, full).replace(/\\/g, '/');
      const src = readFileSync(full, 'utf8');
      if (forbiddenRadius.test(src) && !src.includes("borderRadius: '50%'")) {
        errors.push(`${rel}: borderRadius >10px no permitido en chart/`);
      }
    }
  }
}

const chartDir = join(root, 'apps/web/src/components/chart');
if (existsSync(chartDir)) walkChart(chartDir);

const reportPath = join(root, 'reports/archive/2026-06/epis2-mf-norm-04-shape.md');
if (!existsSync(reportPath)) errors.push('falta reports/archive/2026-06/epis2-mf-norm-04-shape.md');

if (errors.length) {
  console.error('ficha-norm-density-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ficha-norm-density-gate OK — MF-NORM-04');
