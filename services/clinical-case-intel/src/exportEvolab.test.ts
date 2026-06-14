import { describe, expect, it } from 'vitest';
import type { ClinicalCaseRecord } from '@epis2/contracts';
import { buildEvolabScenario, evolabScenarioId, buildEvolabExportBundle } from './exportEvolab.js';

const sampleRecord: ClinicalCaseRecord = {
  caseCode: 'SIM-HIPERTENSI-N-ac1e',
  tier: 'L0_synthetic',
  provenance: {
    sourceType: 'hybrid',
    sourceName: 'synthea',
    license: 'CC0-1.0',
    scrapedAt: '2026-06-12T12:00:00.000Z',
  },
  patient: {
    displayName: 'Paciente Sim — Camila R.',
    birthDate: '1978-04-15',
    sex: 'F',
    isSynthetic: true,
  },
  clinical: {
    scenario: 'HTA en control ambulatorio (sintético)',
    problems: ['Hipertensión arterial esencial (sintético)'],
    observations: [{ label: 'PA', valueText: '142/88 mmHg (sintético)' }],
  },
  epis2Mapping: {
    encounterStatus: 'open',
    summaryFields: {
      activeProblems: 'HTA',
      recentEvents: 'Estable (sintético)',
      relevantLabs: 'PA 142/88',
      activeMedications: 'Losartán',
      pendingItems: 'Control en 7 días (sintético)',
      clinicalAlerts: 'SIM / SINTÉTICO',
    },
    identifierSystem: 'EPIS2-SIM',
  },
  evolabHints: {
    capabilities: ['evolution_note', 'lab_request'],
    suggestedGoals: ['create_evolution_note'],
    risk: 'low',
  },
  generation: {
    promptVersion: 'test',
    requiresHumanReview: true,
    contentHash: 'x',
  },
  fetchedAt: '2026-06-12T12:00:00.000Z',
};

describe('clinical-case-intel exportEvolab', () => {
  it('genera id de escenario estable', () => {
    expect(evolabScenarioId('SIM-HIPERTENSI-N-ac1e')).toBe('sim-hipertensi-n-ac1e-evolution-001');
  });

  it('YAML incluye fixture demoCaseCode y flow API', () => {
    const scenario = buildEvolabScenario(sampleRecord);
    expect(scenario.yaml).toContain('demoCaseCode: SIM-HIPERTENSI-N-ac1e');
    expect(scenario.yaml).toContain('draftType: evolution_note');
    expect(scenario.yaml).toContain('tags:');
    expect(scenario.yaml).toContain('clinical-case-intel');
  });

  it('arma bundle de exportación', () => {
    const bundle = buildEvolabExportBundle([sampleRecord], '/tmp/epis2-evolab');
    expect(bundle.scenarios).toHaveLength(1);
    expect(bundle.scenarios[0]?.filename).toMatch(/\.yaml$/);
  });
});
