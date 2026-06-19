import type { DesignScreenContext } from './designScreenContext.js';
import { runDesignAgent } from './runDesignAgent.js';
import {
  Md3LayoutCriticResultSchema,
  type Md3LayoutCriticResult,
  type DesignAgentRunOutcome,
} from './schemas.js';

export async function md3LayoutCriticAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<Md3LayoutCriticResult>> {
  return runDesignAgent(
    'md3LayoutCriticAgent',
    Md3LayoutCriticResultSchema,
    () => {
      const violations: string[] = [];
      const suggestions: string[] = [];
      if (ctx.scrollPolicy !== 'main-pane-only' && ctx.mode === 'classic') {
        violations.push('Modo clásico debe declarar scroll main-pane-only');
      }
      if (!ctx.testIds?.includes('epis2-classic-md3-shell') && ctx.mode === 'classic') {
        violations.push('Falta shell clásico MD3');
      }
      if (violations.length) {
        suggestions.push('Verificar EpisClassicMd3Shell y data-epis-scroll-policy');
      }
      const score = Math.max(0, 100 - violations.length * 20);
      return {
        score,
        violations,
        suggestions,
        risk: violations.length > 2 ? 'high' : violations.length ? 'medium' : 'low',
      };
    },
    `Evalúa layout MD3 para ${ctx.route}. JSON con score, violations, suggestions, risk.`,
  );
}
