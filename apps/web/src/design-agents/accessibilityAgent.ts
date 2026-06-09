import type { DesignScreenContext } from './designScreenContext.js';
import { runDesignAgent } from './runDesignAgent.js';
import {
  AccessibilityResultSchema,
  type AccessibilityResult,
  type DesignAgentRunOutcome,
} from './schemas.js';

export async function accessibilityAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<AccessibilityResult>> {
  return runDesignAgent(
    'accessibilityAgent',
    AccessibilityResultSchema,
    () => {
      const snippet = ctx.htmlSnippet ?? '';
      const violations: string[] = [];
      const keyboardNavLikely = snippet.includes('tabindex') || snippet.includes('role=');
      if (!keyboardNavLikely) violations.push('Roles ARIA / tabindex no detectados en snippet');
      if (!snippet.includes('aria-label') && ctx.mode === 'classic') {
        violations.push('Action rail podría carecer de aria-label');
      }
      const score = Math.max(0, 100 - violations.length * 20);
      return {
        score,
        violations,
        suggestions: violations.length ? ['Verificar tooltips y aria-label en rail'] : [],
        risk: violations.length ? 'medium' : 'low',
        keyboardNavLikely,
      };
    },
    `Evalúa accesibilidad ${ctx.route}. JSON con score, violations, suggestions, risk, keyboardNavLikely.`,
  );
}
