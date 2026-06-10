import { isClinicalRole, roleHasPermission } from '@epis2/clinical-domain';
import { pickAssistFallback } from './assist-route.js';
import { matchColloquialRule } from './colloquial-rules.js';
import { buildConfirmationMessage, requiresExplicitConfirmation } from './confirmation.js';
import { AMBIGUOUS_PHRASES } from './definitions.js';
import { EPIS_DISAMBIGUATION_RULES } from './epis-disambiguation.js';
import { isEpisOutOfScopePhrase } from './epis-out-of-scope.js';
import { buildGuidedFallbackCandidates, GUIDED_FALLBACK_MESSAGE } from './fallback.js';
import { normalizeCommandText } from './normalize.js';
import { pickBestFromRanked, rankCommandDefinitions } from './rank.js';
import { extractSlots } from './slots.js';
import type { CommandResolveInput, CommandResolveResult } from './types.js';

function rankOptions(input: CommandResolveInput) {
  return {
    ...(input.context ? { context: input.context } : {}),
    hasPatient: Boolean(input.patientId),
    ...(input.assistHint ? { assistHint: input.assistHint } : {}),
  };
}

function clarificationResult(input: {
  message: string;
  ranked: ReturnType<typeof rankCommandDefinitions>;
  role: string;
  normalized: string;
  patientId?: string;
  context?: import('./types.js').CommandActiveContext;
  intentHints?: readonly import('./types.js').ClinicalIntent[];
}): Extract<CommandResolveResult, { status: 'needs_clarification' }> {
  const hinted = input.intentHints?.length
    ? input.ranked.filter((r) => input.intentHints!.includes(r.def.intent))
    : input.ranked;

  const candidates = buildGuidedFallbackCandidates({
    role: input.role,
    normalized: input.normalized,
    ranked: hinted.length > 0 ? hinted : input.ranked,
    hasPatient: Boolean(input.patientId),
    ...(input.intentHints ? { intentHints: input.intentHints } : {}),
    ...(input.context ? { context: input.context } : {}),
  });

  return {
    status: 'needs_clarification',
    message: input.message,
    candidates,
  };
}

export function resolveCommand(input: CommandResolveInput): CommandResolveResult {
  const text = input.text.trim();
  if (!text) {
    return {
      status: 'empty',
      message: 'Escribe qué necesitas hacer para continuar.',
    };
  }

  if (!isClinicalRole(input.role)) {
    return {
      status: 'forbidden',
      message: 'Tu rol no puede ejecutar comandos clínicos.',
      permission: 'command.execute',
    };
  }

  const normalized = normalizeCommandText(text);
  const ranked = rankCommandDefinitions(text, rankOptions(input));
  const clarificationBase = {
    ranked,
    role: input.role,
    normalized,
    ...(input.patientId ? { patientId: input.patientId } : {}),
    ...(input.context ? { context: input.context } : {}),
  };

  const colloquial = input.assistHint ? undefined : matchColloquialRule(normalized);
  if (colloquial) {
    const bestFromRank = pickBestFromRanked(ranked);
    const topScore = ranked[0]?.score ?? 0;
    const secondScore = ranked[1]?.score ?? 0;
    const strongColloquialMatch =
      bestFromRank &&
      colloquial.intentHints.includes(bestFromRank.intent) &&
      topScore >= 78 &&
      (ranked.length === 1 || topScore - secondScore >= 8);

    if (!strongColloquialMatch) {
      return clarificationResult({
        message: colloquial.message,
        ...clarificationBase,
        intentHints: colloquial.intentHints,
      });
    }
  }

  if (isEpisOutOfScopePhrase(normalized)) {
    return clarificationResult({
      message:
        'Esa acción no está disponible en el MVP. Prueba buscar, resumir, evolucionar, epicrisis, receta o laboratorio.',
      ...clarificationBase,
    });
  }

  if (!input.assistHint) {
    for (const rule of EPIS_DISAMBIGUATION_RULES) {
      if (rule.matches(normalized)) {
        return clarificationResult({
          message: rule.message,
          ...clarificationBase,
          intentHints: rule.intentHints,
        });
      }
    }
  }

  if (!input.assistHint && AMBIGUOUS_PHRASES.some((p) => normalizeCommandText(p) === normalized)) {
    return clarificationResult({
      message: 'El comando es ambiguo. Elige una acción más específica.',
      ...clarificationBase,
    });
  }

  let best = pickBestFromRanked(ranked);
  if (!best && input.assistHint) {
    best = pickAssistFallback(ranked, input.assistHint);
  }

  if (!best) {
    if (ranked.length > 1) {
      return clarificationResult({
        message: 'El comando es ambiguo. Elige una acción más específica.',
        ...clarificationBase,
      });
    }
    return clarificationResult({
      message: GUIDED_FALLBACK_MESSAGE,
      ...clarificationBase,
    });
  }

  const role = input.role;
  if (!roleHasPermission(role, best.requiredPermission)) {
    return {
      status: 'forbidden',
      message: 'Tu rol no puede ejecutar este comando.',
      permission: best.requiredPermission,
    };
  }

  if (best.requiresPatient && !input.patientId) {
    return {
      status: 'needs_patient',
      message: 'Selecciona o busca un paciente antes de continuar.',
      intent: best.intent,
      labelEs: best.labelEs,
    };
  }

  const slots = extractSlots(text);

  if (requiresExplicitConfirmation(best.intent) && !input.confirmed) {
    return {
      status: 'needs_confirmation',
      message: buildConfirmationMessage(best, slots),
      intent: best.intent,
      labelEs: best.labelEs,
      routePath: best.routePath,
      safetyLevel: best.safetyLevel,
      slots,
    };
  }

  return {
    status: 'resolved',
    intent: best.intent,
    labelEs: best.labelEs,
    routePath: best.routePath,
    slots,
  };
}
