import { shouldInvokeAssistRoute } from './assist-route.js';
import {
  CLINICAL_ACTION_MANIFEST,
  getClinicalActionByIntent,
} from './clinical-action-manifest.js';
import type { ClinicalIntent, CommandResolveResult } from './types.js';

/** MF-LX-06 — umbral lexicon IA-last (confidence < 0.5 → LLM). */
export const AI_ESCALATION_LEXICON_CONFIDENCE = 0.5;

/** Ninguna acción del manifest demo exige LLM (invariante IA-last). */
export const AI_ESCALATION_MANIFEST_AI_REQUIRED_COUNT = 0;

export type AiEscalationReason =
  | 'lexicon_low_confidence'
  | 'command_needs_clarification'
  | 'command_empty'
  | 'assist_route_eligible'
  | 'action_ai_required'
  | 'none';

export type AiEscalationDecision = {
  escalate: boolean;
  reason: AiEscalationReason;
  confidence?: number;
};

export type AiEscalationInput = {
  lexiconConfidence?: number;
  commandResult?: Pick<CommandResolveResult, 'status'>;
  intentId?: ClinicalIntent;
};

export function shouldEscalateLexiconConfidence(confidence: number): boolean {
  return confidence < AI_ESCALATION_LEXICON_CONFIDENCE;
}

export function shouldEscalateCommandResult(
  result: Pick<CommandResolveResult, 'status'>,
): boolean {
  if (result.status === 'empty') return true;
  if (result.status === 'needs_clarification') return true;
  return shouldInvokeAssistRoute(result as CommandResolveResult);
}

/**
 * Política canónica IA-last — lexicon + command-registry antes de LLM.
 */
export function resolveAiEscalation(input: AiEscalationInput): AiEscalationDecision {
  if (input.intentId) {
    const action = getClinicalActionByIntent(input.intentId);
    if (action && action.aiRequired) {
      return { escalate: true, reason: 'action_ai_required' };
    }
  }

  if (input.commandResult) {
    if (input.commandResult.status === 'empty') {
      return { escalate: true, reason: 'command_empty' };
    }
    if (input.commandResult.status === 'needs_clarification') {
      return {
        escalate: true,
        reason: 'command_needs_clarification',
        ...(input.lexiconConfidence !== undefined
          ? { confidence: input.lexiconConfidence }
          : {}),
      };
    }
    if (shouldInvokeAssistRoute(input.commandResult as CommandResolveResult)) {
      return {
        escalate: true,
        reason: 'assist_route_eligible',
        ...(input.lexiconConfidence !== undefined
          ? { confidence: input.lexiconConfidence }
          : {}),
      };
    }
  }

  if (
    input.lexiconConfidence !== undefined &&
    shouldEscalateLexiconConfidence(input.lexiconConfidence)
  ) {
    return {
      escalate: true,
      reason: 'lexicon_low_confidence',
      confidence: input.lexiconConfidence,
    };
  }

  return { escalate: false, reason: 'none' };
}

export function assertAiEscalationInvariants(): string[] {
  const errors: string[] = [];

  if (AI_ESCALATION_LEXICON_CONFIDENCE <= 0 || AI_ESCALATION_LEXICON_CONFIDENCE >= 1) {
    errors.push('AI_ESCALATION_LEXICON_CONFIDENCE fuera de rango (0,1)');
  }

  let aiRequiredCount = 0;
  for (const entry of CLINICAL_ACTION_MANIFEST) {
    if (entry.aiRequired) aiRequiredCount += 1;
  }
  if (aiRequiredCount !== AI_ESCALATION_MANIFEST_AI_REQUIRED_COUNT) {
    errors.push(
      `manifest aiRequired=${aiRequiredCount} !== ${AI_ESCALATION_MANIFEST_AI_REQUIRED_COUNT}`,
    );
  }

  return errors;
}
