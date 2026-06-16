#!/usr/bin/env node
/** Barra de comando transversal obligatoria en superficies clínicas /espacio/* (Screen Map §0). */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const dock = readFileSync(
  join(root, 'apps/web/src/components/chart/ClinicalTransversalCommandDock.tsx'),
  'utf8',
);
if (!dock.includes('EpisUniversalCommandBar')) {
  errors.push('ClinicalTransversalCommandDock debe montar EpisUniversalCommandBar');
}

const shell = readFileSync(join(root, 'apps/web/src/components/chart/ClinicalShell.tsx'), 'utf8');
if (!shell.includes('EpisUniversalCommandBar')) {
  errors.push('ClinicalShell debe montar EpisUniversalCommandBar (ficha dual)');
}

const layout = readFileSync(join(root, 'apps/web/src/layouts/ClinicalShellLayout.tsx'), 'utf8');
if (!layout.includes('ChartEspacioCommandDock')) {
  errors.push('ClinicalShellLayout debe montar ChartEspacioCommandDock en scaffold');
}

const paper = readFileSync(join(root, 'apps/web/src/pages/StandalonePaperChartPage.tsx'), 'utf8');
if (!paper.includes('ClinicalTransversalCommandDock')) {
  errors.push('StandalonePaperChartPage debe montar ClinicalTransversalCommandDock');
}
if (!paper.includes('epis2-paper-command-bar')) {
  errors.push('StandalonePaperChartPage sin testId epis2-paper-command-bar');
}

const screenMap = join(root, 'docs/design/EPIS2_CLINICAL_SCREEN_MAP.md');
try {
  const map = readFileSync(screenMap, 'utf8');
  if (!map.includes('Barra de comando transversal')) {
    errors.push('EPIS2_CLINICAL_SCREEN_MAP.md debe documentar barra transversal');
  }
} catch {
  errors.push('Falta docs/design/EPIS2_CLINICAL_SCREEN_MAP.md');
}

if (errors.length) {
  console.error(
    'clinical-command-bar-transversal-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log('clinical-command-bar-transversal-gate OK — barra NL transversal en superficies clínicas');
