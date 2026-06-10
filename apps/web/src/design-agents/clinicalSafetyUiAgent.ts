import type { DesignScreenContext } from './designScreenContext.js';
import { includesAny } from './designScreenContext.js';
import { runDesignAgent } from './runDesignAgent.js';
import {
  ClinicalSafetyUiResultSchema,
  type ClinicalSafetyUiResult,
  type DesignAgentRunOutcome,
} from './schemas.js';

export async function clinicalSafetyUiAgent(
  ctx: DesignScreenContext,
): Promise<DesignAgentRunOutcome<ClinicalSafetyUiResult>> {
  return runDesignAgent(
    'clinicalSafetyUiAgent',
    ClinicalSafetyUiResultSchema,
    () => {
      const snippet = ctx.htmlSnippet ?? '';
      const irreversibleInTopBar = includesAny(snippet, [
        'Firmar',
        'Aprobar',
        'Imprimir',
        'Guardar borrador',
      ]);
      const duplicateActionBars =
        countActionBars(snippet) > 1 || (snippet.match(/epis2-form-save/g) ?? []).length > 1;

      const violations: string[] = [];
      if (irreversibleInTopBar && ctx.mode === 'classic') {
        violations.push('Top bar contiene acciones clínicas irreversibles');
      }
      if (duplicateActionBars) violations.push('Más de una ActionBar clínica global');

      const score = Math.max(0, 100 - violations.length * 30);
      return {
        score,
        violations,
        suggestions: violations.length ? ['Centralizar acciones en EpisClinicalFormActionBar'] : [],
        risk: violations.length ? 'high' : 'low',
        irreversibleInTopBar,
        duplicateActionBars,
      };
    },
    `Evalúa seguridad UI clínica ${ctx.route}. JSON con score, violations, suggestions, risk, booleans.`,
  );
}

function countActionBars(snippet: string): number {
  return (snippet.match(/epis2-clinical-form-action-bar|EpisClinicalFormActionBar/gi) ?? []).length;
}
