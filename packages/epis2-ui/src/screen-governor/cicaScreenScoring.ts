import { EPIS2_FORM_SCREEN_TREE, getFormScreenNode } from '@epis2/clinical-forms';
import type {
  DocumentLifecycle,
  ScreenContainerDecision,
  ScreenNeedProposal,
} from './cicaScreenTypes.js';

const DOCUMENT_LIFECYCLE_SCORE: DocumentLifecycle[] = ['draft', 'approved', 'signed', 'audited'];

/** Admission Score CICA-SG — 0–100. Canon EPIS2_CICA_SCREEN_GOVERNOR.md § Screen Admission Score */
export function calculateAdmissionScore(proposal: ScreenNeedProposal): number {
  let score = 0;

  if (proposal.hasDistinctClinicalIntent) score += 25;
  if (proposal.primaryAction?.id && proposal.primaryAction.label) score += 20;

  if (proposal.documentLifecycle && DOCUMENT_LIFECYCLE_SCORE.includes(proposal.documentLifecycle)) {
    score += 20;
  }

  if (proposal.dataComplexity === 'high') score += 15;
  else if (proposal.dataComplexity === 'medium') score += 8;

  if (proposal.riskLevel === 'high') score += 10;
  else if (proposal.riskLevel === 'medium') score += 5;

  if (proposal.temporalNavigation) score += 10;
  if (proposal.needsPrint && proposal.temporalNavigation) score += 10;

  const duplicate = resolveFormTreeDuplicate(proposal);
  if (duplicate.isDuplicate) score -= 20;
  if (proposal.addsCognitiveLoad) score -= 10;

  return Math.max(0, Math.min(100, score));
}

export function resolveFormTreeDuplicate(proposal: ScreenNeedProposal): {
  isDuplicate: boolean;
  reuseScreenId: string | null;
} {
  if (proposal.proposedBlueprintId) {
    const node = getFormScreenNode(proposal.proposedBlueprintId);
    if (node) return { isDuplicate: true, reuseScreenId: node.blueprintId };
  }
  if (proposal.proposedRoute) {
    const node = EPIS2_FORM_SCREEN_TREE.find((n) => n.routePath === proposal.proposedRoute);
    if (node) return { isDuplicate: true, reuseScreenId: node.blueprintId };
  }
  return { isDuplicate: false, reuseScreenId: null };
}

function isBriefInlineCandidate(proposal: ScreenNeedProposal): boolean {
  return (
    proposal.dataComplexity === 'low' &&
    !proposal.needsLargeTextArea &&
    !proposal.temporalNavigation &&
    !proposal.needsPrint &&
    (!proposal.documentLifecycle || proposal.documentLifecycle === 'none')
  );
}

/** Umbral → contenedor candidato (antes de overrides). */
export function decideContainerFromScore(
  score: number,
  proposal: ScreenNeedProposal,
): ScreenContainerDecision {
  if (isBriefInlineCandidate(proposal)) return 'inline-section';

  if (score <= 29) return 'inline-section';

  if (score <= 44) {
    if (proposal.riskLevel && proposal.riskLevel !== 'low' && !proposal.needsSpace) {
      return 'modal';
    }
    return 'drawer';
  }

  if (score <= 59) {
    if (proposal.classicMode !== false && proposal.existingTabId) return 'tab-composed';
    return 'tab';
  }

  if (score <= 79) return 'full-screen-route';

  return 'full-screen-route';
}

export function applyContainerOverrides(
  container: ScreenContainerDecision,
  score: number,
  proposal: ScreenNeedProposal,
  duplicate: { isDuplicate: boolean; reuseScreenId: string | null },
): ScreenContainerDecision {
  if (duplicate.isDuplicate) return 'reject-duplicate';
  if (proposal.temporalNavigation && proposal.needsPrint) return 'dedicated-mode';

  if (
    proposal.needsLargeTextArea &&
    proposal.documentLifecycle &&
    ['draft', 'approved', 'signed'].includes(proposal.documentLifecycle)
  ) {
    return 'full-screen-route';
  }

  if (proposal.riskLevel === 'high' && !proposal.needsSpace && proposal.isStateTransition) {
    return 'modal';
  }

  if (score >= 80 && !(proposal.temporalNavigation && proposal.needsPrint)) {
    return 'full-screen-route';
  }

  return container;
}
