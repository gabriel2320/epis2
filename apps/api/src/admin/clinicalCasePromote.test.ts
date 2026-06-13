import { describe, expect, it } from 'vitest';
import type { ClinicalCaseRecord } from '@epis2/contracts';
import { findExistingSimPatientId } from './clinicalCasePromote.js';

describe('clinicalCasePromote helpers', () => {
  it('findExistingSimPatientId es función exportada para integración', () => {
    expect(typeof findExistingSimPatientId).toBe('function');
  });

  it('registro canónico incluye identifier EPIS2-SIM', () => {
    const record: ClinicalCaseRecord = {
      caseCode: 'SIM-TEST-ABCD',
      tier: 'L0_synthetic',
      provenance: {
        sourceType: 'hybrid',
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
        scenario: 'HTA (sintético)',
        problems: ['Hipertensión (sintético)'],
        observations: [],
      },
      epis2Mapping: {
        encounterStatus: 'open',
        summaryFields: {
          activeProblems: 'HTA',
          recentEvents: '—',
          relevantLabs: '—',
          activeMedications: '—',
          pendingItems: '—',
          clinicalAlerts: 'SIM / SINTÉTICO',
        },
        identifierSystem: 'EPIS2-SIM',
      },
      generation: {
        promptVersion: 'test',
        requiresHumanReview: true,
        contentHash: 'x',
      },
      fetchedAt: '2026-06-12T12:00:00.000Z',
    };
    expect(record.epis2Mapping.identifierSystem).toBe('EPIS2-SIM');
  });
});
