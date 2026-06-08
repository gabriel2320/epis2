import { describe, expect, it } from 'vitest';
import { COMMAND_CENTER_DENSITY, getCommandCenterWireSuggestions } from './chips.js';

describe('getCommandCenterWireSuggestions', () => {
  it('modo densidad: máx. 4 chips y sin tarjetas', () => {
    const { quickChips, cardChips } = getCommandCenterWireSuggestions('physician', [
      'command.execute',
      'dashboard.read',
    ]);

    expect(quickChips.length).toBeGreaterThan(0);
    expect(quickChips.length).toBeLessThanOrEqual(COMMAND_CENTER_DENSITY.maxQuickChips);
    expect(cardChips).toHaveLength(0);
    expect(quickChips.every((c) => !c.intent.startsWith('open_dashboard'))).toBe(true);
  });

  it('richCards restaura tarjetas para Storybook/dev', () => {
    const { cardChips } = getCommandCenterWireSuggestions(
      'physician',
      ['command.execute', 'dashboard.read'],
      { richCards: true },
    );
    expect(cardChips.length).toBeGreaterThan(0);
    expect(cardChips.length).toBeLessThanOrEqual(4);
  });
});
