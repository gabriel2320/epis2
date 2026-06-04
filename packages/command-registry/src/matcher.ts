import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import { normalizeCommandText } from './normalize.js';
import type { CommandDefinition } from './types.js';

export function matchCommandDefinitions(raw: string): CommandDefinition[] {
  const normalized = normalizeCommandText(raw);
  if (!normalized) return [];

  return EPIS2_COMMAND_DEFINITIONS.filter((def) => def.match(normalized));
}

export function pickBestMatch(matches: CommandDefinition[]): CommandDefinition | null {
  if (matches.length === 0) return null;
  const topPriority = Math.min(...matches.map((m) => m.priority));
  const tier = matches.filter((m) => m.priority === topPriority);
  if (tier.length !== 1) return null;
  return tier[0] ?? null;
}
