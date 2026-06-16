import { clinicalLayoutTokens } from './clinicalLayoutTokens.js';

export type ClinicalLayoutProfile =
  | 'census'
  | 'classic-chart'
  | 'clinical-form'
  | 'paper-mode'
  | 'orders'
  | 'results'
  | 'admin-lite'
  | 'patient-search';

export type ClinicalLayoutProfileConfig = {
  maxWidth: number;
  columns: 1 | 12;
  sectionGap: number;
  fieldGap: number;
  primaryActionPosition: 'bottom-right' | 'sticky-bottom' | 'top-toolbar';
  maxVisibleActions: number;
  allowNestedCards: boolean;
};

export const clinicalLayoutProfiles: Record<ClinicalLayoutProfile, ClinicalLayoutProfileConfig> = {
  census: {
    maxWidth: 1280,
    columns: 12,
    sectionGap: 24,
    fieldGap: 16,
    primaryActionPosition: 'bottom-right',
    maxVisibleActions: 3,
    allowNestedCards: false,
  },
  'classic-chart': {
    maxWidth: 1280,
    columns: 12,
    sectionGap: 24,
    fieldGap: 16,
    primaryActionPosition: 'bottom-right',
    maxVisibleActions: 3,
    allowNestedCards: false,
  },
  'clinical-form': {
    maxWidth: 1080,
    columns: 12,
    sectionGap: 24,
    fieldGap: 16,
    primaryActionPosition: 'sticky-bottom',
    maxVisibleActions: 3,
    allowNestedCards: false,
  },
  'paper-mode': {
    maxWidth: clinicalLayoutTokens.page.paperMaxWidth,
    columns: 1,
    sectionGap: 24,
    fieldGap: 16,
    primaryActionPosition: 'top-toolbar',
    maxVisibleActions: 3,
    allowNestedCards: false,
  },
  orders: {
    maxWidth: 1080,
    columns: 12,
    sectionGap: 24,
    fieldGap: 16,
    primaryActionPosition: 'sticky-bottom',
    maxVisibleActions: 3,
    allowNestedCards: false,
  },
  results: {
    maxWidth: 1280,
    columns: 12,
    sectionGap: 24,
    fieldGap: 16,
    primaryActionPosition: 'bottom-right',
    maxVisibleActions: 3,
    allowNestedCards: false,
  },
  'admin-lite': {
    maxWidth: 1280,
    columns: 12,
    sectionGap: 24,
    fieldGap: 16,
    primaryActionPosition: 'bottom-right',
    maxVisibleActions: 3,
    allowNestedCards: false,
  },
  'patient-search': {
    maxWidth: 1120,
    columns: 12,
    sectionGap: 32,
    fieldGap: 16,
    primaryActionPosition: 'sticky-bottom',
    maxVisibleActions: 1,
    allowNestedCards: false,
  },
};

export type ClinicalLayoutActionKind = 'primary' | 'secondary' | 'danger' | 'quiet';

export type ClinicalLayoutAction = {
  id: string;
  label: string;
  kind: ClinicalLayoutActionKind;
  onClick: () => void;
  disabled?: boolean;
  testId?: string;
};

export type NormalizedClinicalActions = {
  primary: ClinicalLayoutAction[];
  visibleSecondary: ClinicalLayoutAction[];
  overflow: ClinicalLayoutAction[];
};

/** Gobernador de acciones — máx. 1 primaria, 2 secundarias visibles, resto overflow. */
export function normalizeClinicalActions(
  actions: readonly ClinicalLayoutAction[],
): NormalizedClinicalActions {
  const { maxPrimary, maxSecondaryVisible } = clinicalLayoutTokens.actionBudget;

  const primary = actions.filter((a) => a.kind === 'primary').slice(0, maxPrimary);
  const nonPrimary = actions.filter((a) => a.kind !== 'primary');
  const visibleSecondary = nonPrimary.slice(0, maxSecondaryVisible);
  const overflow = nonPrimary.slice(maxSecondaryVisible);

  return { primary, visibleSecondary, overflow };
}

export type ClinicalFieldType =
  | 'short'
  | 'medium'
  | 'long'
  | 'textarea'
  | 'date'
  | 'number'
  | 'default';

export type ClinicalFieldSpan = {
  xs: number;
  md: number;
};

/** Span de campo en grilla 12 columnas por tipo clínico. */
export function getFieldSpan(type: ClinicalFieldType): ClinicalFieldSpan {
  switch (type) {
    case 'short':
    case 'number':
      return { xs: 12, md: 3 };
    case 'date':
      return { xs: 12, md: 4 };
    case 'medium':
    case 'default':
      return { xs: 12, md: 6 };
    case 'long':
    case 'textarea':
      return { xs: 12, md: 12 };
    default:
      return { xs: 12, md: 6 };
  }
}

export function resolveLayoutProfile(profile: ClinicalLayoutProfile): ClinicalLayoutProfileConfig {
  return clinicalLayoutProfiles[profile];
}

export type ClinicalLayoutAuditFinding = {
  severity: 'UX-BLOCKER' | 'UX-MAJOR' | 'UX-MINOR';
  message: string;
};

export type ClinicalLayoutAuditInput = {
  primaryButtons: number;
  visibleActions: number;
  cardDepth: number;
  hasHorizontalOverflow: boolean;
  hasClinicalScreen: boolean;
  hasClinicalActionBar: boolean;
  paperStandaloneRoute: boolean;
  paperDayNav: boolean;
};

/** Auditoría estática / E2E — scoring composicional. */
export function auditClinicalLayout(input: ClinicalLayoutAuditInput): {
  findings: ClinicalLayoutAuditFinding[];
  score: number;
} {
  const findings: ClinicalLayoutAuditFinding[] = [];
  let score = 100;

  const { maxPrimary, maxVisibleTotal } = clinicalLayoutTokens.actionBudget;
  const maxCardDepth = clinicalLayoutTokens.maxCardNesting;

  if (input.primaryButtons > maxPrimary) {
    findings.push({
      severity: 'UX-BLOCKER',
      message: 'Más de un botón primario visible',
    });
    score -= 20;
  }

  if (input.hasHorizontalOverflow) {
    findings.push({
      severity: 'UX-BLOCKER',
      message: 'Scroll horizontal inesperado',
    });
    score -= 15;
  }

  if (input.visibleActions > maxVisibleTotal) {
    findings.push({
      severity: 'UX-MAJOR',
      message: 'Demasiadas acciones visibles',
    });
    score -= 10;
  }

  if (input.cardDepth > maxCardDepth) {
    findings.push({
      severity: 'UX-MAJOR',
      message: 'Exceso de cajas anidadas',
    });
    score -= 10;
  }

  if (!input.hasClinicalScreen) {
    findings.push({
      severity: 'UX-MAJOR',
      message: 'Falta ClinicalScreen en pantalla clásica',
    });
    score -= 10;
  }

  if (!input.hasClinicalActionBar && input.visibleActions > 0) {
    findings.push({
      severity: 'UX-MINOR',
      message: 'Falta ClinicalActionBar',
    });
    score -= 5;
  }

  if (!input.paperStandaloneRoute) {
    findings.push({
      severity: 'UX-MAJOR',
      message: 'Modo papel sin ruta exclusiva',
    });
    score -= 10;
  }

  if (!input.paperDayNav) {
    findings.push({
      severity: 'UX-MINOR',
      message: 'Modo papel sin navegación diaria',
    });
    score -= 5;
  }

  return { findings, score: Math.max(0, score) };
}

export type CicaScreenAuditInput = {
  patientIdentityVisible: boolean;
  hasReturnNavigation: boolean;
  primaryButtons: number;
  documentStateVisible: boolean;
  hasUniqueIntent: boolean;
  visibleNavElements: number;
  hasTransversalCommandBar: boolean;
  /** CICA-L — métricas layout opcionales */
  hasHorizontalOverflow?: boolean;
  visibleActions?: number;
  cardDepth?: number;
  primaryContentBlocks?: number;
  maxPrimaryBlocks?: number;
};

export type CicaScreenVerdict = 'GO' | 'PASS_WITH_FIXES' | 'NO-GO';

export function resolveCicaVerdict(score: number): CicaScreenVerdict {
  if (score >= 90) return 'GO';
  if (score >= 80) return 'PASS_WITH_FIXES';
  return 'NO-GO';
}

export type CicaScreenAuditFinding = ClinicalLayoutAuditFinding;

/** CICA / CICA-L — auditoría unificada de pantalla correcta. Objetivo ≥ 90 GO. */
export function auditCicaScreen(input: CicaScreenAuditInput): {
  findings: CicaScreenAuditFinding[];
  score: number;
  verdict: CicaScreenVerdict;
} {
  const findings: CicaScreenAuditFinding[] = [];
  let score = 100;
  const maxNav = 7;
  const { maxPrimary, maxVisibleTotal } = clinicalLayoutTokens.actionBudget;
  const maxCardDepth = clinicalLayoutTokens.maxCardNesting;

  if (!input.patientIdentityVisible) {
    findings.push({ severity: 'UX-MAJOR', message: 'CICA Ley 1: identidad de paciente no visible' });
    score -= 15;
  }
  if (!input.hasReturnNavigation) {
    findings.push({ severity: 'UX-BLOCKER', message: 'CICA Ley 5: falta navegación de retorno' });
    score -= 20;
  }
  if (input.primaryButtons > maxPrimary) {
    findings.push({ severity: 'UX-BLOCKER', message: 'CICA Ley 3: más de una acción primaria' });
    score -= 20;
  }
  if (input.hasHorizontalOverflow) {
    findings.push({ severity: 'UX-BLOCKER', message: 'Scroll horizontal inesperado' });
    score -= 15;
  }
  if (!input.documentStateVisible) {
    findings.push({ severity: 'UX-MINOR', message: 'CICA: estado documento/demo/IA no visible' });
    score -= 15;
  }
  if (!input.hasUniqueIntent) {
    findings.push({ severity: 'UX-MAJOR', message: 'CICA Ley 2: intención no única' });
    score -= 10;
  }
  if (input.visibleNavElements > maxNav) {
    findings.push({
      severity: 'UX-MAJOR',
      message: 'CICA Ley 7: demasiados elementos de navegación visibles',
    });
    score -= 10;
  }
  if (!input.hasTransversalCommandBar) {
    findings.push({
      severity: 'UX-MAJOR',
      message: 'CICA: barra de comando transversal ausente',
    });
    score -= 10;
  }
  if (input.visibleActions !== undefined && input.visibleActions > maxVisibleTotal) {
    findings.push({ severity: 'UX-MAJOR', message: 'CICA-L: demasiadas acciones visibles' });
    score -= 10;
  }
  if (input.cardDepth !== undefined && input.cardDepth > maxCardDepth) {
    findings.push({ severity: 'UX-MAJOR', message: 'CICA-L: exceso de cajas anidadas' });
    score -= 10;
  }
  const blockLimit = input.maxPrimaryBlocks ?? 5;
  if (input.primaryContentBlocks !== undefined && input.primaryContentBlocks > blockLimit) {
    findings.push({
      severity: 'UX-MAJOR',
      message: `CICA-L: más de ${blockLimit} bloques principales`,
    });
    score -= 10;
  }

  const finalScore = Math.max(0, score);
  return { findings, score: finalScore, verdict: resolveCicaVerdict(finalScore) };
}
