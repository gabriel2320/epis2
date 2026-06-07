import {
  listAssistRouteIntentsForRole,
  rankCommandDefinitions,
  resolveCommand,
  sanitizeAssistRouteHint,
  shouldInvokeAssistRoute,
  type CommandResolveInput,
  type CommandResolveResult,
} from '@epis2/command-registry';
import { fetchLocalAiStatus } from '../ai/client.js';
import { requestCommandRouteAssist } from '../ai/commandRouteClient.js';
import type { AppConfig } from '../config.js';

export type ResolveWithAssistOutcome = {
  result: CommandResolveResult;
  assistRouteUsed: boolean;
};

function buildRankOptions(input: CommandResolveInput) {
  return {
    ...(input.context ? { context: input.context } : {}),
    hasPatient: Boolean(input.patientId),
    ...(input.assistHint ? { assistHint: input.assistHint } : {}),
  };
}

export async function resolveCommandWithOptionalAssist(
  config: AppConfig,
  input: CommandResolveInput,
): Promise<ResolveWithAssistOutcome> {
  const first = resolveCommand(input);
  if (!shouldInvokeAssistRoute(first) || input.assistHint) {
    return { result: first, assistRouteUsed: false };
  }

  const localUp = await fetchLocalAiStatus(config.LOCAL_AI_BASE_URL);
  if (!localUp) {
    return { result: first, assistRouteUsed: false };
  }

  const allowedIntents = listAssistRouteIntentsForRole(input.role);
  if (allowedIntents.length === 0) {
    return { result: first, assistRouteUsed: false };
  }

  const ranked = rankCommandDefinitions(input.text, buildRankOptions(input)).slice(0, 5);
  const assistResponse = await requestCommandRouteAssist(config.LOCAL_AI_BASE_URL, {
    text: input.text,
    role: input.role,
    hasPatient: Boolean(input.patientId),
    allowedIntents,
    deterministicCandidates: ranked.map((match) => ({
      intent: match.def.intent,
      score: match.score,
    })),
  });

  if (assistResponse.body.status !== 'success') {
    return { result: first, assistRouteUsed: false };
  }

  const rawHint = assistResponse.body.hint;
  const hint = sanitizeAssistRouteHint(
    {
      confidence: rawHint.confidence,
      missingContext: rawHint.missingContext,
      reason: rawHint.reason,
      suggestedCandidates: rawHint.suggestedCandidates,
      ...(rawHint.intent !== undefined ? { intent: rawHint.intent } : {}),
    },
    input.role,
  );
  if (!hint) {
    return { result: first, assistRouteUsed: false };
  }

  const secondInput: CommandResolveInput = { ...input, assistHint: hint };
  const second = resolveCommand(secondInput);
  return { result: second, assistRouteUsed: true };
}
