import { describe, expect, it } from 'vitest';
import { confirmAiSuggestion, insertAiSuggestion, rejectAiSuggestion } from './paperAiState.js';
import { canSignPaperChart, emptyPaperChartDraft, parsePaperChartBody } from './schema.js';

describe('paperAiState MF-PAPER-03', () => {
  it('inserta IA como ai_draft no confirmado', () => {
    const next = insertAiSuggestion(
      { value: '', source: 'human', confirmed: true },
      'Sugerencia clínica',
    );
    expect(next.source).toBe('ai_draft');
    expect(next.confirmed).toBe(false);
  });

  it('confirmación cambia a human/confirmed', () => {
    const draft = insertAiSuggestion({ value: '', source: 'human', confirmed: true }, 'Texto IA');
    expect(confirmAiSuggestion(draft).confirmed).toBe(true);
  });

  it('firma bloqueada si hay IA no confirmada', () => {
    const body = emptyPaperChartDraft();
    body.soap = insertAiSuggestion(body.soap, 'Plan IA');
    expect(canSignPaperChart(body).ok).toBe(false);
    body.soap = confirmAiSuggestion(body.soap);
    expect(canSignPaperChart(body).ok).toBe(true);
  });

  it('reject limpia valor', () => {
    expect(
      rejectAiSuggestion(insertAiSuggestion({ value: '', source: 'human', confirmed: true }, 'IA'))
        .value,
    ).toBe('');
  });
});

describe('parsePaperChartBody legacy', () => {
  it('normaliza strings legacy', () => {
    expect(parsePaperChartBody({ anamnesis: 'Motivo' }).anamnesis.source).toBe('human');
  });

  it('preserva v2 ai_draft', () => {
    const body = parsePaperChartBody({
      soap: { value: 'Plan', source: 'ai_draft', confirmed: false },
    });
    expect(body.soap.confirmed).toBe(false);
  });
});
