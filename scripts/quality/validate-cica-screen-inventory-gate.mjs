#!/usr/bin/env node
/** CICA-L Fase A/C — ledger activo + inventario/wireframe aprobado. */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../..');
const errors = [];

const activePath = join(root, 'reports/cica-l/cica-l-active.json');
let active = null;
try {
  active = JSON.parse(readFileSync(activePath, 'utf8'));
} catch {
  errors.push('Falta reports/cica-l/cica-l-active.json');
}

if (active) {
  if (!active.activeScreenId) errors.push('cica-l-active.json sin activeScreenId');
  if (!active.activeLedgerFile) errors.push('cica-l-active.json sin activeLedgerFile');

  const ledgerPath = join(root, active.activeLedgerFile ?? '');
  if (!active.activeLedgerFile || !existsSync(ledgerPath)) {
    errors.push(`Ledger activo no encontrado: ${active.activeLedgerFile ?? '(vacío)'}`);
  } else {
    const ledger = readFileSync(ledgerPath, 'utf8');
    for (const section of ['## Fase A — Inventario', '## Fase C — Wireframe']) {
      if (!ledger.includes(section)) {
        errors.push(`${active.activeLedgerFile} sin ${section}`);
      }
    }
    if (!ledger.includes('aprobado')) {
      errors.push(`${active.activeLedgerFile} sin wireframe aprobado (Fase C)`);
    }
  }
}

const cicaL = join(root, 'docs/design/EPIS2_CICA_L.md');
if (!existsSync(cicaL)) {
  errors.push('Falta docs/design/EPIS2_CICA_L.md');
}

if (active?.activeScreenId === 'CICA-L-02') {
  const grid = readFileSync(
    join(root, 'apps/web/src/components/clinical-summary/PatientClinicalSummaryGrid.tsx'),
    'utf8',
  );
  const traditional = readFileSync(
    join(root, 'apps/web/src/components/chart/TraditionalEhrMode.tsx'),
    'utf8',
  );
  if (!grid.includes("compositionMode?: 'default' | 'cica-classic'")) {
    errors.push('PatientClinicalSummaryGrid sin compositionMode cica-classic');
  }
  if (!grid.includes("data-cica-composition': 'classic'")) {
    errors.push('PatientClinicalSummaryGrid sin data-cica-composition=classic');
  }
  if (!traditional.includes('compositionMode="cica-classic"')) {
    errors.push('TraditionalEhrMode debe pasar compositionMode="cica-classic" en resumen');
  }
}

if (active?.activeScreenId === 'CICA-L-03') {
  const config = readFileSync(
    join(root, 'apps/web/src/components/chart/classicChartTabConfig.ts'),
    'utf8',
  );
  const evolution = readFileSync(
    join(root, 'apps/web/src/components/chart/sections/TraditionalEvolutionSection.tsx'),
    'utf8',
  );
  const traditional = readFileSync(
    join(root, 'apps/web/src/components/chart/TraditionalEhrMode.tsx'),
    'utf8',
  );
  if (!config.includes('visibleSectionsForCicaClassicTab')) {
    errors.push('classicChartTabConfig sin visibleSectionsForCicaClassicTab');
  }
  if (!evolution.includes("data-cica-composition': 'classic'")) {
    errors.push('TraditionalEvolutionSection sin data-cica-composition=classic');
  }
  if (!traditional.includes('visibleSectionsForCicaClassicTab')) {
    errors.push('TraditionalEhrMode debe usar visibleSectionsForCicaClassicTab');
  }
  if (evolution.includes('copy.chartModes.actionEvolution')) {
    errors.push('TraditionalEvolutionSection no debe duplicar botón evolución en CICA-L-03');
  }
}

if (active?.activeScreenId === 'CICA-L-04') {
  const formPage = readFileSync(
    join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'),
    'utf8',
  );
  const intent = readFileSync(join(root, 'apps/web/src/clinical/clinicalIntent.ts'), 'utf8');
  if (!formPage.includes('isCicaEvolutionForm')) {
    errors.push('GeneratedClinicalFormPage sin isCicaEvolutionForm (CICA-L-04)');
  }
  if (!formPage.includes('epis2-cica-evolution-form')) {
    errors.push('GeneratedClinicalFormPage sin testId epis2-cica-evolution-form');
  }
  if (formPage.includes('epis2-evolution-traditional-shell')) {
    errors.push('GeneratedClinicalFormPage no debe usar TraditionalEhrMode en evolución (CICA-L-04)');
  }
  if (!intent.includes("blueprint.blueprintId === 'evolution_note'")) {
    errors.push('clinicalIntent.ts sin primaria Guardar para evolution_note');
  }
}

if (active?.activeScreenId === 'CICA-L-05') {
  const intent = readFileSync(join(root, 'apps/web/src/clinical/clinicalIntent.ts'), 'utf8');
  const orders = readFileSync(
    join(root, 'apps/web/src/components/chart/sections/TraditionalOrdersSection.tsx'),
    'utf8',
  );
  const ehr = readFileSync(
    join(root, 'apps/web/src/components/chart/TraditionalEhrMode.tsx'),
    'utf8',
  );
  if (!intent.includes('resolveCicaTabLayoutActions')) {
    errors.push('clinicalIntent.ts sin resolveCicaTabLayoutActions (CICA-L-05)');
  }
  if (!orders.includes("data-cica-composition': 'classic'")) {
    errors.push('TraditionalOrdersSection sin data-cica-composition=classic');
  }
  if (!ehr.includes('resolveCicaTabLayoutActions')) {
    errors.push('TraditionalEhrMode debe usar resolveCicaTabLayoutActions');
  }
}

if (active?.activeScreenId === 'CICA-L-06') {
  const labs = readFileSync(
    join(root, 'apps/web/src/components/chart/sections/TraditionalLabsSection.tsx'),
    'utf8',
  );
  if (!labs.includes("data-cica-composition': 'classic'")) {
    errors.push('TraditionalLabsSection sin data-cica-composition=classic');
  }
  if (!labs.includes('CICA_LABS_MAX_ROWS')) {
    errors.push('TraditionalLabsSection sin presupuesto CICA_LABS_MAX_ROWS (CICA-L-06)');
  }
}

if (active?.activeScreenId === 'CICA-L-07') {
  const meds = readFileSync(
    join(root, 'apps/web/src/components/chart/sections/TraditionalMedsSection.tsx'),
    'utf8',
  );
  if (!meds.includes("data-cica-composition': 'classic'")) {
    errors.push('TraditionalMedsSection sin data-cica-composition=classic');
  }
  if (!meds.includes('CICA_MEDS_MAX_ROWS')) {
    errors.push('TraditionalMedsSection sin presupuesto CICA_MEDS_MAX_ROWS (CICA-L-07)');
  }
}

if (active?.activeScreenId === 'CICA-L-08') {
  const docs = readFileSync(
    join(root, 'apps/web/src/components/chart/sections/TraditionalDocumentsSection.tsx'),
    'utf8',
  );
  const intent = readFileSync(join(root, 'apps/web/src/clinical/clinicalIntent.ts'), 'utf8');
  if (!docs.includes("data-cica-composition': 'classic'")) {
    errors.push('TraditionalDocumentsSection sin data-cica-composition=classic');
  }
  if (!docs.includes('CICA_DOCUMENTS_MAX_ROWS')) {
    errors.push('TraditionalDocumentsSection sin presupuesto CICA_DOCUMENTS_MAX_ROWS (CICA-L-08)');
  }
  if (!intent.includes('onOpenDocuments')) {
    errors.push('clinicalIntent.ts sin onOpenDocuments en resolveCicaTabLayoutActions (CICA-L-08)');
  }
}

if (active?.activeScreenId === 'CICA-L-09') {
  const formPage = readFileSync(
    join(root, 'apps/web/src/pages/GeneratedClinicalFormPage.tsx'),
    'utf8',
  );
  const intent = readFileSync(join(root, 'apps/web/src/clinical/clinicalIntent.ts'), 'utf8');
  if (!formPage.includes('isCicaEpicrisisForm')) {
    errors.push('GeneratedClinicalFormPage sin isCicaEpicrisisForm (CICA-L-09)');
  }
  if (!formPage.includes('epis2-cica-epicrisis-form')) {
    errors.push('GeneratedClinicalFormPage sin testId epis2-cica-epicrisis-form');
  }
  if (!formPage.includes('isCicaDedicatedForm')) {
    errors.push('GeneratedClinicalFormPage sin isCicaDedicatedForm (CICA-L-09)');
  }
  if (!intent.includes("blueprint.blueprintId === 'discharge_summary'")) {
    errors.push('clinicalIntent.ts sin primaria Guardar para discharge_summary');
  }
}

if (active?.activeScreenId === 'CICA-L-10') {
  const paper = readFileSync(
    join(root, 'apps/web/src/pages/StandalonePaperChartPage.tsx'),
    'utf8',
  );
  if (!paper.includes('data-cica-composition="classic"')) {
    errors.push('StandalonePaperChartPage sin data-cica-composition=classic (CICA-L-10)');
  }
  if (!paper.includes('ClinicalPageNav')) {
    errors.push('StandalonePaperChartPage debe usar ClinicalPageNav (CICA-L-10)');
  }
  if (paper.includes('epis2-paper-back-to-chart')) {
    errors.push('StandalonePaperChartPage no debe duplicar back en PaperDayNavBar (CICA-L-10)');
  }
}

if (active?.activeScreenId === 'CICA-L-11') {
  const config = readFileSync(
    join(root, 'apps/web/src/components/chart/classicChartTabConfig.ts'),
    'utf8',
  );
  const audit = readFileSync(
    join(root, 'apps/web/src/components/chart/sections/TraditionalAuditSection.tsx'),
    'utf8',
  );
  const intent = readFileSync(join(root, 'apps/web/src/clinical/clinicalIntent.ts'), 'utf8');
  if (!config.includes("more: ['navMeds', 'navAudit']")) {
    errors.push('classicChartTabConfig debe ubicar navAudit en tab Más (CICA-L-11)');
  }
  const documentsLine = config.split('\n').find((line) => line.includes('documents:'));
  if (documentsLine?.includes('navAudit')) {
    errors.push('navAudit no debe permanecer bajo tab Documentos (CICA-L-11)');
  }
  if (!audit.includes("data-cica-composition': 'classic'")) {
    errors.push('TraditionalAuditSection sin data-cica-composition=classic');
  }
  if (!audit.includes('CICA_AUDIT_MAX_ROWS')) {
    errors.push('TraditionalAuditSection sin presupuesto CICA_AUDIT_MAX_ROWS (CICA-L-11)');
  }
  if (!intent.includes('onOpenAuditSection')) {
    errors.push('clinicalIntent.ts sin onOpenAuditSection (CICA-L-11)');
  }
  if (!intent.includes("sectionId === 'navAudit'")) {
    errors.push('clinicalIntent.ts sin intent audit nivel 5 (CICA-L-11)');
  }
}

if (errors.length) {
  console.error(
    'cica-screen-inventory-gate FAILED:\n' + errors.map((e) => `  - ${e}`).join('\n'),
  );
  process.exit(1);
}

console.log(
  `cica-screen-inventory-gate OK — ${active?.activeScreenId ?? 'CICA-L'} ledger + wireframe`,
);
