import type { CommandResolveResponse } from '@epis2/contracts';
import { EPIS_COMMAND_BAR_MAX_SUGGESTIONS } from '../quality/uiDensityRules.js';

export function classicCommandSuggestionLabels(
  result: CommandResolveResponse | null | undefined,
): string[] | undefined {
  if (!result || result.status !== 'needs_clarification') return undefined;
  return result.candidates.slice(0, EPIS_COMMAND_BAR_MAX_SUGGESTIONS).map((c) => c.labelEs);
}
