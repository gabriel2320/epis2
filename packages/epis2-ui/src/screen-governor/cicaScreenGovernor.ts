import { getFormScreenNode } from '@epis2/clinical-forms';
import type {
  EpisLayoutProfile,
  EpisScreenDefinition,
  EpisScreenProposalResult,
  ScreenContainerDecision,
  ScreenNeedProposal,
} from './cicaScreenTypes.js';
import {
  applyContainerOverrides,
  calculateAdmissionScore,
  decideContainerFromScore,
  resolveFormTreeDuplicate,
} from './cicaScreenScoring.js';

const CONTAINERS_REQUIRING_PRIMARY: ScreenContainerDecision[] = [
  'tab',
  'tab-composed',
  'drawer',
  'full-screen-route',
  'dedicated-mode',
];

/** Inferencia de layout profile — canon EPIS2_CICA_SCREEN_GOVERNOR.md § inferLayoutProfile */
export function inferLayoutProfile(
  container: ScreenContainerDecision,
  proposal: ScreenNeedProposal,
): EpisLayoutProfile {
  if (container === 'dedicated-mode' && proposal.needsPrint) return 'paper-mode';
  if (proposal.needsLargeTextArea || proposal.documentLifecycle === 'draft') return 'clinical-form';
  if (proposal.dataComplexity === 'high' && (container === 'tab' || container === 'tab-composed')) {
    return 'classic-chart';
  }
  if (proposal.needsAuditTrail) return 'audit';
  return 'classic-chart';
}

function collectAutoRejectReasons(proposal: ScreenNeedProposal): string[] {
  const reasons: string[] = [];

  if (proposal.clinicalFreezeWithoutMicrophase) {
    reasons.push('Congelamiento clínico activo sin microfase autorizada');
  }
  if (!proposal.hasDistinctClinicalIntent) {
    reasons.push('No tiene intención clínica propia');
  }
  if (proposal.mixesMultipleIntents) {
    reasons.push('Mezcla más de una intención clínica');
  }
  if (proposal.hidesPatientIdentity) {
    reasons.push('Oculta identidad del paciente (CICA Ley 1)');
  }
  if (proposal.hidesDocumentState) {
    reasons.push('Oculta estado borrador/demo/IA donde corresponde');
  }
  if (proposal.multiplePrimaryActions) {
    reasons.push('Crea más de una acción primaria visible (CICA Ley 3)');
  }
  if (proposal.lacksReturnRoute) {
    reasons.push('No tiene ruta de retorno (CICA Ley 5)');
  }
  if (proposal.addsCognitiveLoad) {
    reasons.push('Aumenta carga cognitiva sin retirar elementos');
  }
  if (proposal.requiresSchemaMigration) {
    reasons.push('Requiere schema/migración/IA producto sin microfase autorizada');
  }
  if (proposal.requiresSecondRegistry) {
    reasons.push('Propone segundo Command/Form Registry temporal');
  }
  if (proposal.contradictsProductInvariants) {
    reasons.push('Contradice PRODUCT_INVARIANTS.md');
  }

  return reasons;
}

function buildRequiredSignals(
  proposal: ScreenNeedProposal,
  container: ScreenContainerDecision,
): EpisScreenDefinition['requiredSignals'] {
  const signals: EpisScreenDefinition['requiredSignals'] = ['patient-identity', 'back-to-chart'];

  if (proposal.documentLifecycle && proposal.documentLifecycle !== 'none') {
    signals.push('draft-status');
  }
  if (container === 'dedicated-mode' || proposal.needsPrint) {
    signals.push('demo-state');
  }
  if (proposal.needsAuditTrail) {
    signals.push('audit-trail');
  }

  return signals;
}

function buildScreenDefinition(
  proposal: ScreenNeedProposal,
  container: ScreenContainerDecision,
): EpisScreenDefinition | undefined {
  const definable: ScreenContainerDecision[] = [
    'full-screen-route',
    'dedicated-mode',
    'tab',
    'tab-composed',
  ];
  if (!definable.includes(container)) return undefined;
  if (!proposal.primaryAction) return undefined;

  const route =
    proposal.proposedRoute ??
    (proposal.proposedBlueprintId
      ? getFormScreenNode(proposal.proposedBlueprintId)?.routePath
      : undefined) ??
    '/espacio/ficha';

  return {
    id: proposal.id,
    route,
    title: proposal.title ?? proposal.clinicalIntent,
    clinicalIntent: proposal.clinicalIntent,
    parent: proposal.parentScreenId ?? '/espacio/ficha',
    patientScoped: proposal.patientScoped ?? true,
    container,
    layoutProfile: inferLayoutProfile(container, proposal),
    primaryAction: {
      id: proposal.primaryAction.id,
      label: proposal.primaryAction.label,
      risk: proposal.primaryAction.risk ?? 'low',
    },
    secondaryActions: [],
    requiredSignals: buildRequiredSignals(proposal, container),
    gates: ['quality:cica-screen-admission-gate', 'quality:cica-screen-governor-gate'],
  };
}

/** CICA-SG — decide admisión de pantalla nueva. Función pura; humano revisa ledger. */
export function proposeEpisScreen(proposal: ScreenNeedProposal): EpisScreenProposalResult {
  const rejectReasons = collectAutoRejectReasons(proposal);
  if (rejectReasons.length > 0) {
    return {
      verdict: 'REJECT',
      container: 'reject',
      admissionScore: calculateAdmissionScore(proposal),
      reuseScreenId: null,
      requiresHumanReview: true,
      rejectReasons,
    };
  }

  const duplicate = resolveFormTreeDuplicate(proposal);
  const admissionScore = calculateAdmissionScore(proposal);
  const candidate = decideContainerFromScore(admissionScore, proposal);
  const container = applyContainerOverrides(candidate, admissionScore, proposal, duplicate);

  if (container === 'reject-duplicate') {
    return {
      verdict: 'REJECT',
      container: 'reject-duplicate',
      admissionScore,
      reuseScreenId: duplicate.reuseScreenId,
      requiresHumanReview: true,
      rejectReasons: ['Duplica pantalla existente — reutilizar registro canónico'],
    };
  }

  const needsPrimary = CONTAINERS_REQUIRING_PRIMARY.includes(container);
  if (needsPrimary && !proposal.primaryAction) {
    return {
      verdict: 'REJECT',
      container: 'reject',
      admissionScore,
      reuseScreenId: null,
      requiresHumanReview: true,
      rejectReasons: ['Sin acción primaria para contenedor que la exige'],
    };
  }

  if (proposal.lacksReturnRoute && container !== 'inline-section' && container !== 'modal') {
    return {
      verdict: 'REJECT',
      container: 'reject',
      admissionScore,
      reuseScreenId: null,
      requiresHumanReview: true,
      rejectReasons: ['No tiene ruta de retorno (CICA Ley 5)'],
    };
  }

  const screenDefinition = buildScreenDefinition(proposal, container);
  return {
    verdict: 'APPROVE',
    container,
    admissionScore,
    reuseScreenId: null,
    requiresHumanReview: true,
    rejectReasons: [],
    ...(screenDefinition ? { screenDefinition } : {}),
  };
}
