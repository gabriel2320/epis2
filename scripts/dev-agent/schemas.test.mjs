/**
 * @vitest-environment node
 */
import { describe, expect, it } from 'vitest';
import { parseDevSessionPlan } from '../../scripts/dev-agent/schemas.mjs';
import {
  parseDevSessionPlanFromOllamaText,
  parseDevLowRiskWritePlanFromOllamaText,
} from '../../scripts/dev-agent/parse-ollama-plan.mjs';
import { parseJsonFromOllamaText } from '../../scripts/ollama/json-from-response.mjs';

describe('dev-agent schemas', () => {
  it('rechaza plan sin requiresHumanReview', () => {
    const result = parseDevSessionPlan({
      activePhase: 'B',
      nextMicrophase: 'MF-FASE-B-001',
      objective: 'Command palette',
      allowedPaths: ['apps/web/src/layouts'],
      gatesToRun: ['npm run check'],
      subagentSequence: ['layers-integrator'],
      requiresHumanReview: false,
    });
    expect(result.ok).toBe(false);
  });

  it('acepta plan dev válido', () => {
    const result = parseDevSessionPlan({
      activePhase: 'B',
      nextMicrophase: 'MF-FASE-B-COMMAND-PALETTE',
      objective: 'Integrar ClinicalCommandPalette en shell',
      allowedPaths: ['apps/web/src/layouts', 'packages/clinical-productivity'],
      forbiddenPatterns: ['OpenMRS'],
      gatesToRun: ['npm run check', 'quality:layers-integration-gate'],
      subagentSequence: ['layers-integrator', 'gate-runner'],
      risks: ['Duplicar registry comando'],
      requiresHumanReview: true,
    });
    expect(result.ok).toBe(true);
  });

  it('parseDevSessionPlanFromOllamaText extrae JSON envuelto', () => {
    const tag = 'think';
    const result = parseDevSessionPlanFromOllamaText(
      `<${tag}>plan</${tag}>` +
        JSON.stringify({
          activePhase: 'C',
          nextMicrophase: 'MF-OLA3-DOCS',
          objective: 'Documentos UI ficha',
          allowedPaths: ['apps/web/src/components'],
          gatesToRun: ['npm run check'],
          subagentSequence: ['layers-integrator'],
          requiresHumanReview: true,
        }),
    );
    expect(result.ok).toBe(true);
  });

  it('parseJsonFromOllamaText rechaza texto plano', () => {
    expect(parseJsonFromOllamaText('sin json').ok).toBe(false);
  });

  it('parseDevLowRiskWritePlanFromOllamaText valida plan escritura', () => {
    const result = parseDevLowRiskWritePlanFromOllamaText(
      JSON.stringify({
        objective: 'Documentar',
        patches: [
          {
            path: 'reports/epis2-test.md',
            action: 'create',
            content: '# Test',
            summary: 'doc',
          },
        ],
        requiresHumanReview: true,
      }),
    );
    expect(result.ok).toBe(true);
  });
});
