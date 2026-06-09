import type { DesignScreenContext } from './designScreenContext.js';
import { includesAny } from './designScreenContext.js';
import { runDesignAgent } from './runDesignAgent.js';
import {
  CommandCenterCriticResultSchema,
  type CommandCenterCriticResult,
  type DesignAgentRunOutcome,
} from './schemas.js';

export async function commandCenterAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<CommandCenterCriticResult>> {
  return runDesignAgent(
    'commandCenterAgent',
    CommandCenterCriticResultSchema,
    () => {
      const violations: string[] = [];
      const testIds = ctx.testIds ?? [];
      const googleBarLike =
        testIds.includes('epis2-command-google-bar') ||
        testIds.includes('epis2-command-hero-power-bar');
      const classicAccessVisible = testIds.includes('epis2-command-classic-access');
      const maxSuggestionsRespected = !includesAny(ctx.htmlSnippet ?? '', [
        'epis2-command-suggestion-cards',
      ]);

      if (!googleBarLike) violations.push('Falta barra Google-like central');
      if (!classicAccessVisible) violations.push('Sin acceso visible a modo clásico');
      if (!maxSuggestionsRespected) violations.push('Tarjetas de sugerencia densas detectadas');
      if (includesAny(ctx.htmlSnippet ?? '', ['EpisBentoGrid', 'dashboard-panel'])) {
        violations.push('Dashboard embebido en /comando');
      }

      const score = Math.max(0, 100 - violations.length * 18);
      return {
        score,
        violations,
        suggestions: violations.length ? ['Usar EpisCommandCenterGoogleBar'] : [],
        risk: violations.length > 2 ? 'high' : violations.length ? 'medium' : 'low',
        googleBarLike,
        classicAccessVisible,
        maxSuggestionsRespected,
      };
    },
    `Evalúa command center ${ctx.route}. JSON con score, violations, suggestions, risk, booleans.`,
  );
}
