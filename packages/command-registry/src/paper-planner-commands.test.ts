import { describe, expect, it } from 'vitest';
import { resolveCommand } from './router.js';
import {
  PAPER_PLANNER_COMMAND_DEFINITIONS,
  getPaperPlannerCommandSuggestions,
  paperPlannerIntentBoost,
} from './paper-planner-commands.js';

describe('paper-planner-commands MF-PAPER-PLANNER-04', () => {
  it('expone tres intents planner', () => {
    expect(PAPER_PLANNER_COMMAND_DEFINITIONS).toHaveLength(3);
    expect(getPaperPlannerCommandSuggestions().length).toBe(3);
  });

  it('resuelve imprimir agenda', () => {
    const result = resolveCommand({
      text: 'imprimir agenda clinica',
      role: 'physician',
      patientId: 'a0000001-0000-4000-8000-000000000001',
      context: { chartMode: 'paper', paperSurface: 'planner', plannerView: 'week' },
    });
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.intent).toBe('paper_planner_print_agenda');
    }
  });

  it('boost planner solo en superficie agenda', () => {
    expect(
      paperPlannerIntentBoost('paper_planner_print_agenda', {
        chartMode: 'paper',
        paperSurface: 'planner',
      }),
    ).toBe(16);
    expect(
      paperPlannerIntentBoost('paper_planner_print_agenda', {
        chartMode: 'paper',
        paperSurface: 'document',
      }),
    ).toBe(0);
  });
});
