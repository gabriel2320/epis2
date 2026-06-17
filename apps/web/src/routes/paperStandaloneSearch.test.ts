import { describe, expect, it } from 'vitest';
import {
  parsePaperStandaloneSearch,
  resolvePaperDate,
  shiftPaperDate,
} from './paperStandaloneSearch.js';

describe('paperStandaloneSearch', () => {
  it('parsea patientId y paperDate', () => {
    const parsed = parsePaperStandaloneSearch({
      patientId: 'p1',
      paperDate: '2026-06-16',
      chartMode: 'paper',
    });
    expect(parsed.patientId).toBe('p1');
    expect(parsed.paperDate).toBe('2026-06-16');
    expect(parsed.chartMode).toBe('paper');
  });

  it('ignora paperDate inválido', () => {
    expect(parsePaperStandaloneSearch({ paperDate: '16-06-2026' }).paperDate).toBeUndefined();
  });

  it('shiftPaperDate avanza y retrocede días', () => {
    expect(shiftPaperDate('2026-06-16', 1)).toBe('2026-06-17');
    expect(shiftPaperDate('2026-06-16', -1)).toBe('2026-06-15');
  });

  it('resolvePaperDate usa hoy si falta', () => {
    const today = new Date().toISOString().slice(0, 10);
    expect(resolvePaperDate({})).toBe(today);
  });
});
