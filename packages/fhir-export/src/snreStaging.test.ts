import { describe, expect, it } from 'vitest';
import { getDemoCaseByCode } from '@epis2/test-fixtures';
import { assertExportClean } from './validateExport.js';
import {
  buildSnreStagingJson,
  EPIS2_SNRE_STAGING_TAG_SYSTEM,
  SNRE_STAGING_PROFILES,
  toSnreStagingMedicationRequest,
  validateSnreStagingMedicationRequest,
} from './snreStaging.js';
import { epis2MedicationRequestResourceSchema } from './profile.js';

const PRESCRIPTION_DRAFT_BODY = {
  medication: 'Losartán',
  dose: '50 mg',
  quantity: '30 comprimidos',
  route: 'oral',
  frequency: '1 vez al día',
  duration: '30 días',
  patientInstructions: 'Tomar con agua',
  clinicalNotes: 'HTA controlada',
} as const;

function prescriptionDraftFixture(draftId: string, patientId: string) {
  return {
    id: draftId,
    patientId,
    draftType: 'prescription' as const,
    body: { ...PRESCRIPTION_DRAFT_BODY },
  };
}

describe('SNRE staging (MF-IC-02)', () => {
  it('round-trip prescription draft → MedicationRequest staging schema', () => {
    const demo = getDemoCaseByCode('DEMO-001')!;
    const source = prescriptionDraftFixture('rx-staging-demo-001', demo.patientId);

    const mr = toSnreStagingMedicationRequest(source, true);
    expect(mr).not.toBeNull();
    expect(mr?.resourceType).toBe('MedicationRequest');
    expect(mr?.status).toBe('draft');
    expect(mr?.meta.profile).toContain(SNRE_STAGING_PROFILES.medicationRequest);

    const schemaParse = epis2MedicationRequestResourceSchema.safeParse(mr);
    expect(schemaParse.success).toBe(true);

    const validated = validateSnreStagingMedicationRequest(mr);
    expect(validated.ok).toBe(true);

    expect(assertExportClean(mr).ok).toBe(true);
  });

  it('buildSnreStagingJson marca staging y noRealSend', () => {
    const demo = getDemoCaseByCode('DEMO-005')!;
    const source = prescriptionDraftFixture('rx-staging-demo-005', demo.patientId);

    const payload = buildSnreStagingJson(source, true);
    expect(payload).not.toBeNull();
    expect(payload?.staging).toBe(true);
    expect(payload?.noRealSend).toBe(true);
    expect(validateSnreStagingMedicationRequest(payload!.medicationRequest).ok).toBe(true);
    expect(payload?.medicationRequest.medicationCodeableConcept.text).toBe('Losartán');
  });

  it('meta incluye tag SNRE staging y synthetic demo', () => {
    const demo = getDemoCaseByCode('DEMO-001')!;
    const mr = toSnreStagingMedicationRequest(
      prescriptionDraftFixture('rx-tag-check', demo.patientId),
      true,
    );
    expect(
      mr?.meta.tag?.some((t) => t.system === EPIS2_SNRE_STAGING_TAG_SYSTEM && t.code === 'staging'),
    ).toBe(true);
    expect(mr?.meta.tag?.some((t) => t.code === 'synthetic')).toBe(true);
  });

  it('retorna null si draftType no es prescription', () => {
    const demo = getDemoCaseByCode('DEMO-001')!;
    const skip = toSnreStagingMedicationRequest(
      {
        id: 'not-rx',
        patientId: demo.patientId,
        draftType: 'evolution_note',
        body: { medication: 'No debe exportar' },
      },
      true,
    );
    expect(skip).toBeNull();
  });

  it('retorna null si falta medication', () => {
    const demo = getDemoCaseByCode('DEMO-001')!;
    const skip = toSnreStagingMedicationRequest(
      {
        id: 'rx-empty',
        patientId: demo.patientId,
        draftType: 'prescription',
        body: { dose: '50 mg' },
      },
      true,
    );
    expect(skip).toBeNull();
  });
});
