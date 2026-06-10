import type { DesignScreenContext } from './designScreenContext.js';
import { countMatches } from './designScreenContext.js';
import { runDesignAgent } from './runDesignAgent.js';
import {
  VisualDensityResultSchema,
  type VisualDensityResult,
  type DesignAgentRunOutcome,
} from './schemas.js';

export async function visualDensityAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<VisualDensityResult>> {
  return runDesignAgent(
    'visualDensityAgent',
    VisualDensityResultSchema,
    () => {
      const snippet = ctx.htmlSnippet ?? '';
      const cardCountEstimate = countMatches(snippet, /MuiCard-root|epis2-card/gi);
      const iconCountEstimate = countMatches(snippet, /MuiSvgIcon-root|IconButton/gi);
      const violations: string[] = [];
      if (cardCountEstimate > 6) violations.push('Exceso de cards');
      if (iconCountEstimate > 12) violations.push('Exceso de iconos');
      const score = Math.max(
        0,
        100 - violations.length * 25 - Math.max(0, cardCountEstimate - 4) * 5,
      );
      return {
        score,
        violations,
        suggestions: violations.length ? ['Preferir listas compactas y action budget'] : [],
        risk: violations.length ? 'medium' : 'low',
        cardCountEstimate,
        iconCountEstimate,
      };
    },
    `Evalúa densidad visual ${ctx.route}. JSON con score, violations, suggestions, risk, counts.`,
  );
}
