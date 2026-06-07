import { describe, expect, it } from 'vitest';
import { resolveCommandWithAutoConfirm } from '@epis2/command-registry';
import {
  DEMO_NARRATIVE_EPISODES,
  assertDemoNarrativesInvariants,
  getDemoNarrativeById,
  getPrimaryNarrativeForDemoCode,
} from './demoNarratives.js';
import { getDemoCaseByCode } from './demoCases.js';

describe('DEMO_NARRATIVE_EPISODES (UX-A.4)', () => {
  it('define 5 episodios piloto con invariantes', () => {
    expect(assertDemoNarrativesInvariants()).toEqual([]);
    expect(DEMO_NARRATIVE_EPISODES).toHaveLength(5);
  });

  it('cada episodio apunta a un caso demo existente', () => {
    for (const episode of DEMO_NARRATIVE_EPISODES) {
      expect(getDemoCaseByCode(episode.demoCaseCode)?.patientId).toBeTruthy();
    }
  });

  it('comandos sugeridos resuelven con paciente demo', () => {
    for (const episode of DEMO_NARRATIVE_EPISODES) {
      const demo = getDemoCaseByCode(episode.demoCaseCode)!;
      const result = resolveCommandWithAutoConfirm({
        text: episode.suggestedCommandEs,
        role: 'physician',
        patientId: demo.patientId,
      });
      expect(result.status, episode.id).toBe('resolved');
      if (result.status === 'resolved') {
        expect(result.intent).toBe(episode.intent);
      }
    }
  });

  it('expone lookup por id y código', () => {
    expect(getDemoNarrativeById('bacteremia')?.demoCaseCode).toBe('DEMO-005');
    expect(getPrimaryNarrativeForDemoCode('DEMO-001')?.id).toBe('iam');
    expect(getPrimaryNarrativeForDemoCode('DEMO-999')).toBeUndefined();
  });

  it('gate 30s: episodio incluye título, relato y comando', () => {
    for (const episode of DEMO_NARRATIVE_EPISODES) {
      expect(episode.titleEs.length).toBeGreaterThan(5);
      expect(episode.oneLinerEs.length).toBeGreaterThan(10);
      expect(episode.suggestedCommandEs.length).toBeGreaterThan(3);
    }
  });
});
