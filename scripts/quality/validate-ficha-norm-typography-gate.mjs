#!/usr/bin/env node
/** MF-NORM-05 — tipografía, padding, bold e icon budget ficha dual. */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const rulesPath = join(root, 'apps/web/src/quality/uiDensityRules.ts');
const rules = readFileSync(rulesPath, 'utf8');

if (!rules.includes('workspace: 10')) {
  errors.push('EPIS_ICON_BUDGET.workspace debe ser 10 (MF-NORM-05)');
}
if (!rules.includes('EPIS_COMMAND_BAR_MAX_SUGGESTIONS = 3')) {
  errors.push('EPIS_COMMAND_BAR_MAX_SUGGESTIONS debe ser 3');
}
if (!rules.includes('EPIS_CLINICAL_CARD_MAX_FONT_WEIGHT = 600')) {
  errors.push('uiDensityRules debe definir EPIS_CLINICAL_CARD_MAX_FONT_WEIGHT');
}

const cardPath = join(root, 'apps/web/src/components/clinical-summary/EpisClinicalSummaryCard.tsx');
const cardSrc = readFileSync(cardPath, 'utf8');
if (!cardSrc.includes('EpisM3Text')) {
  errors.push('EpisClinicalSummaryCard debe usar EpisM3Text');
}

const navPath = join(root, 'apps/web/src/components/chart/TraditionalSectionNav.tsx');
const navSrc = readFileSync(navPath, 'utf8');
if (!navSrc.includes('EpisM3Text')) {
  errors.push('TraditionalSectionNav debe usar EpisM3Text');
}
if (!navSrc.includes('EPIS_CLINICAL_CARD_MAX_FONT_WEIGHT')) {
  errors.push('TraditionalSectionNav debe usar EPIS_CLINICAL_CARD_MAX_FONT_WEIGHT');
}

const forbiddenBold = /\bfontWeight:\s*(700|800|900|['"]bold['"])/;

function scanDir(relDir) {
  const dir = join(root, relDir);
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) scanDir(relative(root, full).replace(/\\/g, '/'));
    else if (/\.(tsx|ts)$/.test(name)) {
      const rel = relative(root, full).replace(/\\/g, '/');
      const src = readFileSync(full, 'utf8');
      if (forbiddenBold.test(src)) {
        errors.push(`${rel}: fontWeight 700+ no permitido en ficha/resumen`);
      }
    }
  }
}

scanDir('apps/web/src/components/chart');
scanDir('apps/web/src/components/clinical-summary');

const reportPath = join(root, 'reports/archive/2026-06/epis2-mf-norm-05-typography.md');
if (!existsSync(reportPath))
  errors.push('falta reports/archive/2026-06/epis2-mf-norm-05-typography.md');

if (errors.length) {
  console.error('ficha-norm-typography-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'));
  process.exit(1);
}
console.log('ficha-norm-typography-gate OK — MF-NORM-05');
