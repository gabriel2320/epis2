import { describe, expect, it } from 'vitest';
import { pickBestFromRanked, rankCommandDefinitions } from './rank.js';
import { resolveCommand } from './router.js';

const DEMO_PATIENT_ID = '00000000-0000-4000-8000-000000000001';

describe('context ranking (CE-1)', () => {
  it('abrir ficha con paciente activo resuelve open_patient_chart', () => {
    const result = resolveCommand({
      text: 'abrir ficha',
      role: 'physician',
      patientId: DEMO_PATIENT_ID,
    });
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.intent).toBe('open_patient_chart');
      expect(result.routePath).toBe('/espacio/ficha');
    }
  });

  it('abrir ficha sin paciente pide paciente', () => {
    const result = resolveCommand({
      text: 'abrir ficha',
      role: 'physician',
    });
    expect(result.status).toBe('needs_patient');
    if (result.status === 'needs_patient') {
      expect(result.intent).toBe('open_patient_chart');
    }
  });

  it('abrir ficha de Juan sigue siendo búsqueda', () => {
    const result = resolveCommand({
      text: 'abrir ficha de Juan',
      role: 'physician',
    });
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.intent).toBe('search_patient');
    }
  });

  it('alertas activas priorizan revisar resultados sobre solicitar laboratorio', () => {
    const withoutContext = rankCommandDefinitions('revisar pendientes', {
      hasPatient: true,
    });
    const withAlerts = rankCommandDefinitions('revisar pendientes', {
      hasPatient: true,
      context: { activeAlertCount: 3, workspace: 'patient_chart' },
    });
    const inboxWithout = withoutContext.find((r) => r.def.intent === 'open_results_inbox')?.score ?? 0;
    const inboxWith = withAlerts.find((r) => r.def.intent === 'open_results_inbox')?.score ?? 0;
    expect(inboxWith).toBeGreaterThan(inboxWithout);
  });

  it('borradores pendientes impulsan evolución en ranking', () => {
    const without = rankCommandDefinitions('nota de evolucion', { hasPatient: true });
    const withDrafts = rankCommandDefinitions('nota de evolucion', {
      hasPatient: true,
      context: { pendingDraftCount: 2, workspace: 'patient_chart' },
    });
    const evoWithout =
      without.find((r) => r.def.intent === 'create_evolution_draft')?.score ?? 0;
    const evoWith =
      withDrafts.find((r) => r.def.intent === 'create_evolution_draft')?.score ?? 0;
    expect(evoWith).toBeGreaterThan(evoWithout);
  });

  it('open_patient_chart gana con boost de paciente fijado', () => {
    const ranked = rankCommandDefinitions('ver ficha', { hasPatient: true });
    const best = pickBestFromRanked(ranked);
    expect(best?.intent).toBe('open_patient_chart');
  });
});
