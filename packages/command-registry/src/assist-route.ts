import { isClinicalRole, roleHasPermission } from '@epis2/clinical-domain';
import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import type { RankedCommandMatch } from './rank.js';
import { pickBestFromRanked, SCORE_GAP_FOR_UNIQUE } from './rank.js';
import type {
  ClinicalIntent,
  CommandAssistHint,
  CommandDefinition,
  CommandRequiredContext,
  CommandResolveResult,
} from './types.js';

export const ASSIST_ROUTE_RESOLVE_CONFIDENCE = 0.72;
export const ASSIST_ROUTE_MIN_CONFIDENCE = 0.55;

export type AssistRouteIntentCatalogEntry = {
  intent: ClinicalIntent;
  labelEs: string;
  description: string;
};

export function listAssistRouteIntentsForRole(role: string): AssistRouteIntentCatalogEntry[] {
  if (!isClinicalRole(role)) return [];
  return EPIS2_COMMAND_DEFINITIONS.filter((def) =>
    roleHasPermission(role, def.requiredPermission),
  ).map((def) => ({
    intent: def.intent,
    labelEs: def.labelEs,
    description: def.description,
  }));
}

export function shouldInvokeAssistRoute(result: CommandResolveResult): boolean {
  return result.status === 'needs_clarification';
}

const VALID_MISSING: ReadonlySet<CommandRequiredContext> = new Set([
  'patient',
  'encounter',
  'draft',
]);

export function sanitizeAssistRouteHint(
  raw: {
    intent?: string;
    confidence: number;
    missingContext?: readonly string[];
    reason: string;
    suggestedCandidates?: readonly string[];
  },
  role: string,
): CommandAssistHint | null {
  if (!isClinicalRole(role)) return null;
  if (raw.confidence < ASSIST_ROUTE_MIN_CONFIDENCE) return null;

  const allowed = new Set(listAssistRouteIntentsForRole(role).map((entry) => entry.intent));
  if (allowed.size === 0) return null;

  const suggestedCandidates: ClinicalIntent[] = [];
  for (const id of raw.suggestedCandidates ?? []) {
    if (allowed.has(id as ClinicalIntent) && !suggestedCandidates.includes(id as ClinicalIntent)) {
      suggestedCandidates.push(id as ClinicalIntent);
    }
  }

  let intent: ClinicalIntent | undefined;
  if (raw.intent && allowed.has(raw.intent as ClinicalIntent)) {
    intent = raw.intent as ClinicalIntent;
    if (!suggestedCandidates.includes(intent)) {
      suggestedCandidates.unshift(intent);
    }
  }

  const missingContext = (raw.missingContext ?? []).filter((ctx): ctx is CommandRequiredContext =>
    VALID_MISSING.has(ctx as CommandRequiredContext),
  );

  if (!intent && suggestedCandidates.length === 0) return null;

  const hint: CommandAssistHint = {
    confidence: Math.min(1, raw.confidence),
    reason: raw.reason.slice(0, 240),
    suggestedCandidates,
    missingContext,
  };
  if (intent) hint.intent = intent;
  return hint;
}

export function applyAssistScoreBoost(
  def: CommandDefinition,
  hint: CommandAssistHint | undefined,
): number {
  if (!hint) return 0;
  let boost = 0;
  if (hint.intent === def.intent) {
    boost = Math.max(boost, Math.round(hint.confidence * 28));
  }
  if (hint.suggestedCandidates.includes(def.intent)) {
    boost = Math.max(boost, 12);
  }
  return boost;
}

export function pickAssistFallback(
  ranked: RankedCommandMatch[],
  hint: CommandAssistHint,
): CommandDefinition | null {
  const boostedBest = pickBestFromRanked(ranked);
  if (boostedBest) return boostedBest;

  if (!hint.intent || hint.confidence < ASSIST_ROUTE_RESOLVE_CONFIDENCE) {
    return null;
  }

  const primary = ranked.find((r) => r.def.intent === hint.intent);
  if (primary) {
    const second = ranked.find((r) => r.def.intent !== hint.intent);
    if (!second || primary.score - second.score >= SCORE_GAP_FOR_UNIQUE) {
      return primary.def;
    }
    return null;
  }

  const def = EPIS2_COMMAND_DEFINITIONS.find((entry) => entry.intent === hint.intent);
  if (def && hint.suggestedCandidates.includes(hint.intent)) {
    return def;
  }

  return null;
}
