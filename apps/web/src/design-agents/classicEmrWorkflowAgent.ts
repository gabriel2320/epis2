import type { DesignScreenContext } from './designScreenContext.js';
import { includesAny } from './designScreenContext.js';
import { runDesignAgent } from './runDesignAgent.js';
import {
  ClassicEmrWorkflowResultSchema,
  type ClassicEmrWorkflowResult,
  type DesignAgentRunOutcome,
} from './schemas.js';

export async function classicEmrWorkflowAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<ClassicEmrWorkflowResult>> {
  return runDesignAgent(
    'classicEmrWorkflowAgent',
    ClassicEmrWorkflowResultSchema,
    () => {
      const violations: string[] = [];
      const testIds = ctx.testIds ?? [];
      const patientAlwaysVisible = testIds.includes('epis2-classic-md3-patient-header');
      const mainPaneWritable = testIds.includes('epis2-classic-md3-main-pane');
      const supportingPaneNonCompeting = !includesAny(ctx.htmlSnippet ?? '', [
        'Firmar',
        'Guardar borrador',
      ]);

      if (ctx.mode !== 'classic') violations.push('No está en modo clásico');
      if (!patientAlwaysVisible) violations.push('Patient header no detectado');
      if (!mainPaneWritable) violations.push('Main pane no detectado');
      if (!supportingPaneNonCompeting) violations.push('Supporting pane duplica acciones globales');

      const score = Math.max(0, 100 - violations.length * 15);
      return {
        score,
        violations,
        suggestions: violations.length
          ? ['Revisar ClassicMd3WorkspaceLayout y supporting pane']
          : [],
        risk: violations.length > 2 ? 'high' : violations.length ? 'medium' : 'low',
        patientAlwaysVisible,
        mainPaneWritable,
        supportingPaneNonCompeting,
      };
    },
    `Evalúa workflow EMR clásico ${ctx.route}. JSON con score, violations, suggestions, risk, booleans.`,
  );
}
