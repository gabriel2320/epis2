import { describe, expect, it } from 'vitest';
import { buildContextPanelSuggestions } from './contextPanelSuggestions.js';

describe('contextPanelSuggestions MF-CM-05', () => {
  it('prioriza alertas activas', () => {
    const items = buildContextPanelSuggestions({
      role: 'physician',
      aiAvailable: false,
      activeAlertCount: 2,
    });
    expect(items[0]?.intent).toBe('open_results_inbox');
  });

  it('prioriza conciliación en navMeds', () => {
    const items = buildContextPanelSuggestions({
      role: 'physician',
      aiAvailable: false,
      traditionalSection: 'navMeds',
    });
    expect(items.some((i) => i.intent === 'reconcile_medications')).toBe(true);
  });

  it('incluye resumen IA cuando Ollama disponible', () => {
    const items = buildContextPanelSuggestions({
      role: 'physician',
      aiAvailable: true,
    });
    expect(items[0]?.intent).toBe('summarize_patient');
    expect(items[0]?.labelEs).toContain('IA');
  });

  it('limita cantidad de sugerencias', () => {
    const items = buildContextPanelSuggestions(
      {
        role: 'physician',
        aiAvailable: true,
        activeAlertCount: 1,
        pendingDraftCount: 2,
        traditionalSection: 'navOrders',
      },
      3,
    );
    expect(items.length).toBeLessThanOrEqual(3);
  });
});
