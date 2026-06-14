import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

/** Resultado auditoría visual modo papel (MF-PAPER-09 + FichaPapel). */
export type PaperVisualAuditResult = {
  hasPaperPageClass: boolean;
  hasPrintMediaRules: boolean;
  hasBaselineGrid: boolean;
  printHidesToolbar: boolean;
  hasSectionTestIds: boolean;
  noPrintHideOnFooter: boolean;
  hasFichaPapelReferenceModule: boolean;
  hasSectionChrome: boolean;
  hasLabsTable: boolean;
  hasPatientStrip: boolean;
  toolbarUsesPaperChrome: boolean;
  hasExtendedSections: boolean;
  hasCalmPaperCanvas: boolean;
  hasPlannerCommandHints: boolean;
  score: number;
};

const ROOT = process.cwd();

function readProjectFile(relativePath: string): string {
  const path = join(ROOT, relativePath);
  if (!existsSync(path)) return '';
  return readFileSync(path, 'utf8');
}

/** Auditoría estática de artefactos papel (CSS + template + referencia FichaPapel). */
export function auditPaperVisualArtifacts(): PaperVisualAuditResult {
  const printCss = readProjectFile('apps/web/src/components/chart/paper/paperChartPrint.css');
  const template = readProjectFile('apps/web/src/components/chart/paper/PaperChartTemplate.tsx');
  const sectionChrome = readProjectFile(
    'apps/web/src/components/chart/paper/paperSectionChrome.tsx',
  );
  const footer = readProjectFile('apps/web/src/components/chart/paper/PaperFooter.tsx');
  const reference = readProjectFile('packages/epis2-ui/src/theme/paper-visual-reference.ts');
  const toolbar = readProjectFile('apps/web/src/components/chart/PaperDocumentToolbar.tsx');

  const checks = {
    hasPaperPageClass: printCss.includes('.epis2-paper-page'),
    hasPrintMediaRules: printCss.includes('@media print'),
    hasBaselineGrid: printCss.includes('--epis2-paper-baseline'),
    printHidesToolbar: printCss.includes('epis2-paper-document-toolbar'),
    hasSectionTestIds: template.includes('epis2-paper-section-'),
    noPrintHideOnFooter: footer.includes('epis2-paper-page-footer'),
    hasFichaPapelReferenceModule:
      reference.includes('FICHAPAPEL_VISUAL_REFERENCE') &&
      existsSync(join(ROOT, 'docs/design/EPIS2_FICHAPAPEL_VISUAL_REFERENCE.md')),
    hasSectionChrome: template.includes('PaperSectionChrome'),
    hasLabsTable: sectionChrome.includes('epis2-paper-labs-table'),
    hasExtendedSections:
      sectionChrome.includes('socialWork') &&
      sectionChrome.includes('epis2-paper-sub-nursing-nanda'),
    hasPatientStrip: template.includes('PaperPatientStrip'),
    toolbarUsesPaperChrome:
      toolbar.includes('epis2PaperCalmChromeBarSx') || toolbar.includes('epis2PaperChromeBarSx'),
    hasCalmPaperCanvas: readProjectFile(
      'apps/web/src/components/chart/paper/PaperPageCanvas.tsx',
    ).includes('epis2PaperCalmCanvasSx'),
    hasPlannerCommandHints: readProjectFile(
      'apps/web/src/components/chart/paper/planner/PaperPlannerShell.tsx',
    ).includes('PaperPlannerCommandHints'),
  };

  const values = Object.values(checks);
  const score = values.filter(Boolean).length / values.length;

  return { ...checks, score };
}

/** Umbral mínimo signoff PROG-PAPER-MODE / MF-PA-08. */
export const PAPER_VISUAL_AUDIT_MIN_SCORE = 0.92;

export function paperVisualAuditPasses(result: PaperVisualAuditResult): boolean {
  return result.score >= PAPER_VISUAL_AUDIT_MIN_SCORE;
}
