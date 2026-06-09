import type { DesignScreenContext } from './designScreenContext.js';
import { runDesignAgent } from './runDesignAgent.js';
import {
  PatchPlanSchema,
  type PatchPlan,
  type DesignAgentRunOutcome,
} from './schemas.js';

/** Solo planifica — nunca modifica código ni lógica clínica. */
export async function patchPlannerAgent(
  ctx: DesignScreenContext,
  violations: readonly string[],
): Promise<DesignAgentRunOutcome<PatchPlan>> {
  return runDesignAgent(
    'patchPlannerAgent',
    PatchPlanSchema,
    () => {
      const files: string[] = [];
      const changes: string[] = [];
      const gatesRequired = ['npm run quality:classic-md3-ai-mode-gate'];

      if (ctx.mode === 'classic') {
        files.push('apps/web/src/components/classic-md3/EpisClassicMd3Shell.tsx');
        changes.push('Ajustar scroll policy o supporting pane según violaciones');
      }
      if (ctx.pathname === '/comando') {
        files.push('apps/web/src/components/command-center/EpisCommandCenterGoogleBar.tsx');
        changes.push('Reforzar barra Google-like y acceso modo clásico');
        gatesRequired.push('npm run quality:command-center-googlebar-gate');
      }

      for (const v of violations) {
        changes.push(`Mitigar: ${v}`);
      }

      return {
        files,
        changes,
        risks: ['Revisión humana obligatoria antes de aplicar parche'],
        testsRequired: [
          'apps/web/src/components/classic-md3/EpisClassicMd3Shell.test.tsx',
          'apps/web/src/pages/CommandCenterPage.test.tsx',
        ],
        gatesRequired,
      };
    },
    `Plan de parche para ${ctx.route} sin tocar lógica clínica. JSON PatchPlan.`,
  );
}
