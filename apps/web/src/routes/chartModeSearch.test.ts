import { describe, expect, it } from 'vitest';
import { parseChartModeSearch, resolveChartMode } from './chartModeSearch.js';

describe('parseChartModeSearch', () => {
  it('parsea chartMode traditional y paper', () => {
    expect(parseChartModeSearch({ chartMode: 'traditional' }).chartMode).toBe('traditional');
    expect(parseChartModeSearch({ chartMode: 'paper' }).chartMode).toBe('paper');
  });

  it('ignora chartMode inválido', () => {
    expect(parseChartModeSearch({ chartMode: 'dashboard' }).chartMode).toBeUndefined();
  });

  it('default traditional con resolveChartMode', () => {
    expect(resolveChartMode(parseChartModeSearch({}))).toBe('traditional');
    expect(resolveChartMode(parseChartModeSearch({ chartMode: 'paper' }))).toBe('paper');
  });

  it('parsea section y printFormat válidos', () => {
    expect(parseChartModeSearch({ section: 'anamnesis' }).section).toBe('anamnesis');
    expect(parseChartModeSearch({ printFormat: 'a5' }).printFormat).toBe('a5');
    expect(parseChartModeSearch({ section: 'invalid' }).section).toBeUndefined();
  });
});
