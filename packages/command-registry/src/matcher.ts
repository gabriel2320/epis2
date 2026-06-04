import { pickBestFromRanked, rankCommandDefinitions } from './rank.js';
import type { CommandDefinition } from './types.js';

export function matchCommandDefinitions(raw: string): CommandDefinition[] {
  return rankCommandDefinitions(raw).map((r) => r.def);
}

/** @deprecated Prefer rankCommandDefinitions + pickBestFromRanked con el texto original. */
export function pickBestMatch(
  matches: CommandDefinition[],
  raw?: string,
): CommandDefinition | null {
  if (matches.length === 0) return null;
  if (raw) {
    const ranked = rankCommandDefinitions(raw).filter((r) =>
      matches.some((m) => m.intent === r.def.intent),
    );
    return pickBestFromRanked(ranked);
  }
  if (matches.length === 1) return matches[0] ?? null;
  const topPriority = Math.min(...matches.map((m) => m.priority));
  const tier = matches.filter((m) => m.priority === topPriority);
  if (tier.length !== 1) return null;
  return tier[0] ?? null;
}
