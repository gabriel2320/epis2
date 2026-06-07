import { describe, expect, it } from 'vitest';
import { requiresExplicitConfirmation } from './confirmation.js';
import { resolveCommand } from './router.js';
import { extractSlots } from './slots.js';

const DEMO_PATIENT_ID = '00000000-0000-4000-8000-000000000001';

describe('confirmation gate (CE-2)', () => {
  it('order intents requieren confirmación explícita', () => {
    expect(requiresExplicitConfirmation('prepare_prescription')).toBe(true);
    expect(requiresExplicitConfirmation('request_laboratory')).toBe(true);
    expect(requiresExplicitConfirmation('create_evolution_draft')).toBe(false);
    expect(requiresExplicitConfirmation('prepare_discharge_draft')).toBe(false);
  });

  it('solicitar laboratorio pide confirmación sin flag confirmed', () => {
    const result = resolveCommand({
      text: 'solicitar hemograma por fiebre',
      role: 'physician',
      patientId: DEMO_PATIENT_ID,
    });
    expect(result.status).toBe('needs_confirmation');
    if (result.status === 'needs_confirmation') {
      expect(result.intent).toBe('request_laboratory');
      expect(result.slots.studyHint).toBe('hemograma');
      expect(result.slots.clinicalReasonHint).toContain('fiebre');
      expect(result.message.length).toBeGreaterThan(20);
    }
  });

  it('solicitar laboratorio resuelve tras confirmación', () => {
    const result = resolveCommand({
      text: 'solicitar hemograma',
      role: 'physician',
      patientId: DEMO_PATIENT_ID,
      confirmed: true,
    });
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.intent).toBe('request_laboratory');
    }
  });

  it('interconsulta extrae especialidad en slots', () => {
    const slots = extractSlots('crear interconsulta a cardiologia urgente');
    expect(slots.specialtyHint).toBeTruthy();
    expect(slots.urgencyHint).toBe('urgent');
  });
});
