import { describe, expect, it } from 'vitest';
import {
  MIN_MATCH_SCORE,
  pickBestFromRanked,
  rankCommandDefinitions,
  scoreCommandDefinition,
} from './rank.js';
import { EPIS2_COMMAND_DEFINITIONS } from './definitions.js';
import { normalizeCommandText } from './normalize.js';

describe('rankCommandDefinitions (MAU v2)', () => {
  it('hemograma prioriza solicitud de laboratorio', () => {
    const ranked = rankCommandDefinitions('hemograma');
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked[0]?.def.intent).toBe('request_laboratory');
    expect(pickBestFromRanked(ranked)?.intent).toBe('request_laboratory');
  });

  it('egreso prioriza epicrisis', () => {
    const ranked = rankCommandDefinitions('egreso');
    expect(ranked[0]?.def.intent).toBe('prepare_discharge_draft');
    expect(pickBestFromRanked(ranked)?.intent).toBe('prepare_discharge_draft');
  });

  it('buscar paciente resuelve sin ambigüedad', () => {
    const ranked = rankCommandDefinitions('buscar paciente');
    const best = pickBestFromRanked(ranked);
    expect(best?.intent).toBe('search_patient');
    expect(ranked[0]?.score).toBeGreaterThanOrEqual(MIN_MATCH_SCORE);
  });

  it('frases con varios intents fuertes quedan sin ganador único', () => {
    const ranked = rankCommandDefinitions('evolucion y epicrisis');
    expect(ranked.length).toBeGreaterThan(1);
    expect(pickBestFromRanked(ranked)).toBeNull();
  });

  it('reseta normaliza y puntúa receta', () => {
    const normalized = normalizeCommandText('reseta paracetamol');
    const rx = EPIS2_COMMAND_DEFINITIONS.find((d) => d.intent === 'prepare_prescription');
    expect(rx).toBeDefined();
    const score = scoreCommandDefinition(rx!, normalized, 'reseta paracetamol');
    expect(score).toBeGreaterThanOrEqual(MIN_MATCH_SCORE);
  });
});
