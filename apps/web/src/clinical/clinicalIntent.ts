import { copy } from '@epis2/design-system';
import type { ClinicalFormBlueprint } from '@epis2/clinical-forms';
import { getFormScreenNode } from '@epis2/clinical-forms';
import type { ClinicalLayoutAction } from '@epis2/epis2-ui';
import { tabForSection, type ClassicChartTabId } from '../components/chart/classicChartTabConfig.js';
import type { TraditionalSectionId } from '../components/chart/TraditionalSectionNav.js';
import { EPIS2_CLINICAL_HOME } from '../routes/home.js';

/** Niveles CICA — ver docs/design/EPIS2_CICA.md */
export type CicaLevel = 0 | 1 | 2 | 3 | 4 | 5;

export type ClinicalIntentId =
  | 'login'
  | 'census'
  | 'patient_shell'
  | 'section_summary'
  | 'section_evolutions'
  | 'section_orders'
  | 'section_exams'
  | 'section_meds'
  | 'section_documents'
  | 'section_discharge'
  | 'paper_mode'
  | 'clinical_form'
  | 'draft_review'
  | 'audit';

export type ClinicalIntentResolution = {
  level: CicaLevel;
  intentId: ClinicalIntentId;
  sectionLabel: string;
  primaryActionLabel: string;
};

const TAB_INTENT: Record<
  ClassicChartTabId,
  { intentId: ClinicalIntentId; primaryActionLabel: string }
> = {
  summary: {
    intentId: 'section_summary',
    primaryActionLabel: copy.chartModes.navEvolution,
  },
  evolutions: {
    intentId: 'section_evolutions',
    primaryActionLabel: copy.chartModes.navEvolution,
  },
  orders: {
    intentId: 'section_orders',
    primaryActionLabel: copy.chartModes.navOrders,
  },
  exams: {
    intentId: 'section_exams',
    primaryActionLabel: copy.chartModes.navLabs,
  },
  documents: {
    intentId: 'section_documents',
    primaryActionLabel: copy.chartModes.navDocuments,
  },
  more: {
    intentId: 'section_meds',
    primaryActionLabel: copy.chartModes.navMeds,
  },
};

export function resolveIntentFromTraditionalSection(
  sectionId: TraditionalSectionId,
): ClinicalIntentResolution {
  if (sectionId === 'navAudit') {
    return {
      level: 5,
      intentId: 'audit',
      sectionLabel: copy.chartModes.navAudit,
      primaryActionLabel: copy.adminConsole.tabAudit,
    };
  }
  const tab = tabForSection(sectionId);
  const tabMeta = TAB_INTENT[tab];
  const sectionLabel = copy.chartModes[sectionId];
  return {
    level: 3,
    intentId: tabMeta.intentId,
    sectionLabel,
    primaryActionLabel: tabMeta.primaryActionLabel,
  };
}

export function resolveIntentFromBlueprint(
  blueprint: ClinicalFormBlueprint,
): ClinicalIntentResolution {
  const node = getFormScreenNode(blueprint.blueprintId);
  const primaryActionLabel =
    blueprint.blueprintId === 'evolution_note' || blueprint.blueprintId === 'discharge_summary'
      ? copy.forms.save
      : copy.forms.saveDraft;
  return {
    level: blueprint.blueprintId === 'patient_search' ? 1 : 4,
    intentId: blueprint.blueprintId === 'patient_search' ? 'census' : 'clinical_form',
    sectionLabel: node?.label ?? blueprint.label,
    primaryActionLabel,
  };
}

export function resolvePaperModeIntent(): ClinicalIntentResolution {
  return {
    level: 4,
    intentId: 'paper_mode',
    sectionLabel: copy.chartModes.paperStandalone.pageTitle,
    primaryActionLabel: copy.chartModes.printPreview,
  };
}

export function resolveDraftReviewIntent(title?: string): ClinicalIntentResolution {
  return {
    level: 5,
    intentId: 'draft_review',
    sectionLabel: title ?? copy.drafts.reviewTitle,
    primaryActionLabel: copy.drafts.approveHuman,
  };
}

/** CICA-L — acciones de barra según tab activo (1 primaria contextual). */
export type CicaTabLayoutHandlers = {
  onOpenEvolution?: (() => void) | undefined;
  onNewOrder?: (() => void) | undefined;
  onOpenResults?: (() => void) | undefined;
  onOpenDocuments?: (() => void) | undefined;
  onPaperMode?: (() => void) | undefined;
  onOpenPrescription?: (() => void) | undefined;
  onOpenAuditSection?: (() => void) | undefined;
  onOpenAuditConsole?: (() => void) | undefined;
};

export type CicaTabLayoutOptions = {
  activeSection?: TraditionalSectionId | undefined;
};

export function resolveCicaTabLayoutActions(
  tab: ClassicChartTabId,
  handlers: CicaTabLayoutHandlers,
  options?: CicaTabLayoutOptions,
): ClinicalLayoutAction[] {
  const actions: ClinicalLayoutAction[] = [];
  const activeSection = options?.activeSection;

  if (activeSection === 'navAudit') {
    if (handlers.onOpenAuditConsole) {
      actions.push({
        id: 'audit-console',
        label: copy.adminConsole.tabAudit,
        kind: 'primary',
        onClick: handlers.onOpenAuditConsole,
        testId: 'epis2-chart-layout-audit',
      });
    }
    if (handlers.onPaperMode) {
      actions.push({
        id: 'paper-mode',
        label: copy.chartModes.paper,
        kind: 'secondary',
        onClick: handlers.onPaperMode,
        testId: 'epis2-chart-layout-paper',
      });
    }
    return actions;
  }

  const pushPaper = () => {
    if (!handlers.onPaperMode) return;
    actions.push({
      id: 'paper-mode',
      label: copy.chartModes.paper,
      kind: 'secondary',
      onClick: handlers.onPaperMode,
      testId: 'epis2-chart-layout-paper',
    });
  };

  switch (tab) {
    case 'orders':
      if (handlers.onNewOrder) {
        actions.push({
          id: 'new-order',
          label: copy.chartModes.actionOrder,
          kind: 'primary',
          onClick: handlers.onNewOrder,
          testId: 'epis2-chart-layout-new-order',
        });
      }
      pushPaper();
      if (handlers.onOpenEvolution) {
        actions.push({
          id: 'new-evolution',
          label: copy.chartModes.navEvolution,
          kind: 'quiet',
          onClick: handlers.onOpenEvolution,
          testId: 'epis2-chart-layout-new-evolution',
        });
      }
      break;
    case 'exams':
      if (handlers.onOpenResults) {
        actions.push({
          id: 'results',
          label: copy.chartModes.navLabs,
          kind: 'primary',
          onClick: handlers.onOpenResults,
          testId: 'epis2-chart-layout-results',
        });
      }
      pushPaper();
      break;
    case 'more':
      if (handlers.onOpenPrescription) {
        actions.push({
          id: 'prescription',
          label: copy.chartModes.navMeds,
          kind: 'primary',
          onClick: handlers.onOpenPrescription,
          testId: 'epis2-chart-layout-prescription',
        });
      }
      pushPaper();
      if (handlers.onOpenAuditSection) {
        actions.push({
          id: 'audit-section',
          label: copy.chartModes.navAudit,
          kind: 'quiet',
          onClick: handlers.onOpenAuditSection,
          testId: 'epis2-chart-layout-audit-trail',
        });
      }
      break;
    case 'documents':
      if (handlers.onOpenDocuments) {
        actions.push({
          id: 'documents',
          label: copy.chartModes.navDocuments,
          kind: 'primary',
          onClick: handlers.onOpenDocuments,
          testId: 'epis2-chart-layout-documents',
        });
      }
      pushPaper();
      break;
    default:
      if (handlers.onOpenEvolution) {
        actions.push({
          id: 'new-evolution',
          label: copy.chartModes.navEvolution,
          kind: 'primary',
          onClick: handlers.onOpenEvolution,
          testId: 'epis2-chart-layout-new-evolution',
        });
      }
      pushPaper();
      if (handlers.onOpenResults) {
        actions.push({
          id: 'results',
          label: copy.chartModes.navLabs,
          kind: 'quiet',
          onClick: handlers.onOpenResults,
          testId: 'epis2-chart-layout-results',
        });
      }
      break;
  }

  return actions;
}

/** Rutas de retorno canónicas CICA Ley 5. */
export const CICA_RETURN_ROUTES = {
  census: EPIS2_CLINICAL_HOME,
  patientChart: '/espacio/ficha' as const,
  paperStandalone: '/espacio/ficha/papel' as const,
};

/** Orden clínico de secciones — Ley 6 CICA (referencia; visibilidad en classicChartTabConfig). */
export const CICA_SECTION_RANK_ORDER = [
  'summary',
  'evolutions',
  'orders',
  'exams',
  'meds',
  'documents',
  'discharge',
  'paper',
  'audit',
] as const;

/** Checklist CICA — admisión de pantalla nueva. */
export const CICA_SCREEN_ADMISSION_CHECKLIST = [
  '¿Tiene intención clínica propia?',
  '¿Tiene acción principal clara?',
  '¿No duplica otra pantalla?',
  '¿Reduce complejidad en vez de aumentarla?',
  '¿Tiene retorno claro (Ley 5)?',
  '¿Mantiene visible paciente y estado (Ley 1)?',
  '¿Puede probarse con un gate?',
] as const;
