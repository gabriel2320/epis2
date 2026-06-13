import { describe, expect, it } from 'vitest';
import type { ClinicalCaseRecord } from '@epis2/contracts';
import {
  buildExportBundle,
  recordToSimClinicalCase,
  renderSimCasesTs,
  renderSimSeedSql,
} from './exportFixtures.js';

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
    scenario: 'HTA en control (sintético)',
    problems: ['Hipertensión arterial esencial (sintético)'],
    observations: [{ label: 'PA', valueText: '142/88 mmHg (sintético)' }],
    medications: [{ name: 'Losartan (demo)', doseText: '50 mg daily', status: 'active' }],
  },
  epis2Mapping: {
    encounterStatus: 'open',
    summaryFields: {
      activeProblems: 'HTA',
      recentEvents: 'Estable (sintético)',
      relevantLabs: 'PA 142/88',
      activeMedications: 'Losartan',
      pendingItems: 'Control 7 días',
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

describe('clinical-case-intel exportFixtures', () => {
  it('mapea registro a caso fixture con UUIDs estables', () => {
    const sim = recordToSimClinicalCase(sampleRecord);
    expect(sim.demoCaseCode).toBe('SIM-HIPERTENSI-N-ac1e');
    expect(sim.patientId).toBe('a0000002-0000-4000-8000-7e3ca20d97a4');
    expect(sim.encounterId).toBe('b0000002-0000-4000-8000-039d1a575718');
  });

  it('genera SQL idempotente con EPIS2-SIM', () => {
    const sql = renderSimSeedSql([sampleRecord]);
    expect(sql).toContain('EPIS2-SIM');
    expect(sql).toContain('ON CONFLICT (id) DO NOTHING');
    expect(sql).toContain('SIM-HIPERTENSI-N-ac1e');
  });

  it('genera simCases.ts con array exportable', () => {
    const bundle = buildExportBundle([sampleRecord]);
    const ts = renderSimCasesTs(bundle.cases);
    expect(ts).toContain('SIM_CLINICAL_CASES');
    expect(ts).toContain('SIM-HIPERTENSI-N-ac1e');
  });
});
