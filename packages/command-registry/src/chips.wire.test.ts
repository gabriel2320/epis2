import { describe, expect, it } from 'vitest';
import { getCommandCenterWireSuggestions } from './chips.js';

describe('getCommandCenterWireSuggestions', () => {
  it('devuelve chips rápidos y tarjetas clínicas sin dashboard', () => {
    const { quickChips, cardChips } = getCommandCenterWireSuggestions('physician', [
      'command.execute',
      'dashboard.read',
    ]);

    expect(quickChips.length).toBeGreaterThan(0);
    expect(quickChips.length).toBeLessThanOrEqual(5);
    expect(cardChips.length).toBeGreaterThan(0);
    expect(cardChips.length).toBeLessThanOrEqual(4);
    expect(quickChips.every((c) => !c.intent.startsWith('open_dashboard'))).toBe(true);
    expect(cardChips.every((c) => !c.intent.startsWith('open_dashboard'))).toBe(true);
  });
});
