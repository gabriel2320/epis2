import { describe, expect, it } from 'vitest';
import { resolveCommand } from './router.js';
import {
  PAPER_CHART_COMMAND_DEFINITIONS,
  getPaperChartCommandSuggestions,
  paperChartIntentBoost,
} from './paper-commands.js';
import { applyContextScoreBoost } from './context-rank.js';
import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';

describe('paper-commands MF-PAPER-08', () => {
  it('registra 6 comandos papel en catálogo global', () => {
    expect(PAPER_CHART_COMMAND_DEFINITIONS.length).toBe(6);
    for (const intent of [
      'paper_order_soap',
      'paper_detect_pending',
      'paper_prepare_print',
    ]) {
      expect(EPIS2_COMMAND_DEFINITIONS.some((d) => d.intent === intent)).toBe(true);
    }
  });

  it('resuelve ordenar en soap en modo papel', () => {
    const result = resolveCommand({
      text: 'ordenar en soap',
      role: 'physician',
      patientId: '00000000-0000-4000-8000-000000000001',
      context: { chartMode: 'paper', workspace: 'patient_chart' },
    });
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.intent).toBe('paper_order_soap');
    }
  });

  it('resuelve detectar pendientes', () => {
    const result = resolveCommand({
      text: 'detectar pendientes ficha',
      role: 'physician',
      patientId: '00000000-0000-4000-8000-000000000001',
      context: { chartMode: 'paper', workspace: 'patient_chart' },
    });
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.intent).toBe('paper_detect_pending');
    }
  });

  it('expone sugerencias Ctrl+K papel', () => {
    const suggestions = getPaperChartCommandSuggestions();
    expect(suggestions.length).toBeGreaterThanOrEqual(6);
    expect(suggestions.some((s) => s.includes('ordenar'))).toBe(true);
  });

  it('boost en chartMode=paper', () => {
    const def = PAPER_CHART_COMMAND_DEFINITIONS.find((d) => d.intent === 'paper_detect_pending')!;
    const boost = applyContextScoreBoost(
      def,
      { chartMode: 'paper', workspace: 'patient_chart' },
      true,
    );
    expect(boost).toBeGreaterThanOrEqual(14);
    expect(paperChartIntentBoost('paper_detect_pending', 'paper')).toBe(14);
  });
});
