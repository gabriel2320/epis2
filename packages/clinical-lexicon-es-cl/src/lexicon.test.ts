import { describe, expect, it } from 'vitest';
import { COMMAND_INTENT_TOP10 } from '@epis2/command-registry';
import { CLINICAL_LEXICON_ES_CL } from './buildLexicon.js';
import { resolveClinicalLexicon, shouldEscalateToAi } from './resolve.js';

describe('clinical-lexicon-es-cl MF-LX-02', () => {
  it('construye entradas desde manifest', () => {
    expect(CLINICAL_LEXICON_ES_CL.length).toBeGreaterThan(50);
    expect(CLINICAL_LEXICON_ES_CL.some((e) => e.intentId === 'create_evolution_draft')).toBe(true);
  });

  it('resuelve sinónimos exactos sin IA', () => {
    const result = resolveClinicalLexicon('evolucionar');
    expect(result.intentId).toBe('create_evolution_draft');
    expect(result.source).toBe('exact');
    expect(shouldEscalateToAi(result)).toBe(false);
  });

  it('resuelve abreviaturas clínicas', () => {
    const result = resolveClinicalLexicon('rx');
    expect(result.intentId).toBe('prepare_prescription');
    expect(result.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it('resuelve frases coloquiales de alta', () => {
    const result = resolveClinicalLexicon('listo para irse');
    expect(result.intentId).toBe('prepare_discharge_draft');
    expect(result.source).toBe('colloquial');
  });

  it('top10 intents tienen cobertura lexicon', () => {
    const covered = new Set(CLINICAL_LEXICON_ES_CL.map((e) => e.intentId));
    const missing = COMMAND_INTENT_TOP10.filter((entry) => !covered.has(entry.intent));
    expect(missing.map((m) => m.intent)).toEqual([]);
  });

  it('marca ambigüedad para texto vacío', () => {
    const result = resolveClinicalLexicon('   ');
    expect(result.confidence).toBe(0);
    expect(shouldEscalateToAi(result)).toBe(true);
  });
});
