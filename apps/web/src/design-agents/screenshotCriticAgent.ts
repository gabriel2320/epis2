import type { DesignScreenContext } from './designScreenContext.js';
import { runDesignAgent } from './runDesignAgent.js';
import {
  ScreenshotCriticResultSchema,
  type ScreenshotCriticResult,
  type DesignAgentRunOutcome,
} from './schemas.js';

export async function screenshotCriticAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<ScreenshotCriticResult>> {
  return runDesignAgent(
    'screenshotCriticAgent',
    ScreenshotCriticResultSchema,
    () => {
      const violations: string[] = [];
      if (!ctx.screenshotPath) {
        violations.push('Sin screenshot — modo advisory');
      }
      const score = ctx.screenshotPath ? 85 : 70;
      return {
        score,
        violations,
        suggestions: ctx.screenshotPath
          ? ['Revisión humana del PNG en reports/screenshots/classic-md3/']
          : ['Ejecutar npm run quality:classic-screenshot-advisory'],
        risk: 'low',
        ...(ctx.screenshotPath ? { screenshotPath: ctx.screenshotPath } : {}),
      };
    },
    `Evalúa screenshot ${ctx.screenshotPath ?? 'missing'}. JSON con score, violations, suggestions, risk.`,
  );
}
