import { describe, expect, it } from 'vitest';
import type { ClinicalCaseRecord } from '@epis2/contracts';
import { validateClinicalCaseRecord } from './validate.js';

const baseRecord: ClinicalCaseRecord = {
  caseCode: 'SIM-TEST-0001',
  tier: 'L0_synthetic',
  provenance: {
    sourceType: 'scraped',
    sourceName: 'synthea',
    license: 'CC0-1.0',
    scrapedAt: '2026-06-12T12:00:00.000Z',
  },
  patient: {
    displayName: 'Paciente Sim — Test',
    birthDate: '1980-01-01',
    sex: 'F',
    isSynthetic: true,
  },
  clinical: {
    scenario: 'HTA ambulatoria (sintético)',
    problems: ['Hipertensión arterial (sintético)'],
    observations: [{ label: 'PA', valueText: '130/80 mmHg (sintético)' }],
  },
  epis2Mapping: {
    encounterStatus: 'open',
    summaryFields: {
      activeProblems: 'HTA',
      recentEvents: '—',
      relevantLabs: '—',
      activeMedications: '—',
      pendingItems: '—',
      clinicalAlerts: 'SIM / SINTÉTICO — sin alertas reales',
    },
    identifierSystem: 'EPIS2-SIM',
  },
  generation: {
    promptVersion: 'test',
    requiresHumanReview: true,
    contentHash: 'abc',
  },
  fetchedAt: '2026-06-12T12:00:00.000Z',
};

describe('clinical-case-intel validate', () => {
  it('acepta registro sintético válido', () => {
    expect(validateClinicalCaseRecord(baseRecord)).toEqual([]);
  });

  it('rechaza RUT en payload', () => {
    const issues = validateClinicalCaseRecord({
      ...baseRecord,
      clinical: {
        ...baseRecord.clinical,
        scenario: 'Paciente 12.345.678-9 con HTA',
      },
    });
    expect(issues.some((i) => i.message.includes('RUT'))).toBe(true);
  });
});
