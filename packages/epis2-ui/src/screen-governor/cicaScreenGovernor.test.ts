import { describe, expect, it } from 'vitest';
import { proposeEpisScreen } from './cicaScreenGovernor.js';
import { calculateAdmissionScore } from './cicaScreenScoring.js';
import type { ScreenNeedProposal } from './cicaScreenTypes.js';

const basePrimary = { id: 'primary', label: 'Acción principal' };

describe('CICA-SG — calculateAdmissionScore', () => {
  it('suma pesos canónicos y clampa 0–100', () => {
    const proposal: ScreenNeedProposal = {
      id: 'score-full',
      clinicalIntent: 'Documento clínico',
      hasDistinctClinicalIntent: true,
      primaryAction: basePrimary,
      documentLifecycle: 'draft',
      dataComplexity: 'high',
      riskLevel: 'high',
      temporalNavigation: true,
      needsPrint: true,
    };
    expect(calculateAdmissionScore(proposal)).toBe(100);
  });

  it('penaliza duplicado y carga cognitiva', () => {
    const proposal: ScreenNeedProposal = {
      id: 'score-penalty',
      clinicalIntent: 'Duplicado',
      hasDistinctClinicalIntent: true,
      primaryAction: basePrimary,
      proposedBlueprintId: 'evolution_note',
      addsCognitiveLoad: true,
    };
    expect(calculateAdmissionScore(proposal)).toBe(15);
  });
});

describe('CICA-SG — proposeEpisScreen (10 casos fijos)', () => {
  it('1 — alergias: dato breve → inline-section', () => {
    const result = proposeEpisScreen({
      id: 'allergy-inline',
      clinicalIntent: 'Registrar alergia en banda identidad',
      hasDistinctClinicalIntent: true,
      primaryAction: { id: 'add-allergy', label: 'Añadir alergia' },
      dataComplexity: 'low',
      documentLifecycle: 'none',
    });
    expect(result.verdict).toBe('APPROVE');
    expect(result.container).toBe('inline-section');
  });

  it('2 — evoluciones: tab existente → tab-composed', () => {
    const result = proposeEpisScreen({
      id: 'evolutions-tab',
      clinicalIntent: 'Consultar evoluciones del paciente',
      hasDistinctClinicalIntent: true,
      primaryAction: { id: 'open-evolution', label: 'Nueva evolución' },
      dataComplexity: 'medium',
      existingTabId: 'evolutions',
      classicMode: true,
      parentScreenId: '/espacio/ficha',
    });
    expect(result.verdict).toBe('APPROVE');
    expect(result.container).toBe('tab-composed');
    expect(result.screenDefinition?.layoutProfile).toBe('classic-chart');
  });

  it('3 — nueva evolución: borrador + textarea → full-screen-route', () => {
    const result = proposeEpisScreen({
      id: 'new-evolution-form',
      clinicalIntent: 'Redactar evolución médica',
      hasDistinctClinicalIntent: true,
      primaryAction: { id: 'save-evolution', label: 'Guardar' },
      documentLifecycle: 'draft',
      needsLargeTextArea: true,
      proposedRoute: '/espacio/evolucion-propuesta-test',
      title: 'Evolución médica',
    });
    expect(result.verdict).toBe('APPROVE');
    expect(result.container).toBe('full-screen-route');
    expect(result.screenDefinition?.layoutProfile).toBe('clinical-form');
  });

  it('4 — modo papel: temporal + print → dedicated-mode', () => {
    const result = proposeEpisScreen({
      id: 'paper-mode',
      clinicalIntent: 'Leer ficha por fecha e imprimir',
      hasDistinctClinicalIntent: true,
      primaryAction: { id: 'print', label: 'Imprimir' },
      temporalNavigation: true,
      needsPrint: true,
      proposedRoute: '/espacio/ficha/papel-propuesta-test',
      title: 'Ficha clínica papel',
    });
    expect(result.verdict).toBe('APPROVE');
    expect(result.container).toBe('dedicated-mode');
    expect(result.screenDefinition?.layoutProfile).toBe('paper-mode');
  });

  it('5 — epicrisis: ciclo documental + textarea → full-screen-route', () => {
    const result = proposeEpisScreen({
      id: 'epicrisis',
      clinicalIntent: 'Redactar epicrisis de alta',
      hasDistinctClinicalIntent: true,
      primaryAction: { id: 'save-discharge', label: 'Guardar epicrisis' },
      documentLifecycle: 'draft',
      needsLargeTextArea: true,
      dataComplexity: 'high',
      proposedRoute: '/espacio/epicrisis-propuesta-test',
    });
    expect(result.verdict).toBe('APPROVE');
    expect(result.container).toBe('full-screen-route');
  });

  it('6 — duplicado evolution_note → reject-duplicate', () => {
    const result = proposeEpisScreen({
      id: 'dup-evolution',
      clinicalIntent: 'Duplicar formulario evolución',
      hasDistinctClinicalIntent: true,
      primaryAction: basePrimary,
      proposedBlueprintId: 'evolution_note',
    });
    expect(result.verdict).toBe('REJECT');
    expect(result.container).toBe('reject-duplicate');
    expect(result.reuseScreenId).toBe('evolution_note');
  });

  it('7 — sin intención clínica propia → REJECT', () => {
    const result = proposeEpisScreen({
      id: 'no-intent',
      clinicalIntent: 'Widget decorativo',
      hasDistinctClinicalIntent: false,
    });
    expect(result.verdict).toBe('REJECT');
    expect(result.rejectReasons.some((r) => r.includes('intención clínica'))).toBe(true);
  });

  it('8 — mezcla intenciones → REJECT', () => {
    const result = proposeEpisScreen({
      id: 'mixed-intent',
      clinicalIntent: 'Evolución + receta en una pantalla',
      hasDistinctClinicalIntent: true,
      mixesMultipleIntents: true,
      primaryAction: basePrimary,
    });
    expect(result.verdict).toBe('REJECT');
    expect(result.rejectReasons.some((r) => r.includes('Mezcla'))).toBe(true);
  });

  it('9 — tab sin acción primaria → REJECT', () => {
    const result = proposeEpisScreen({
      id: 'tab-no-primary',
      clinicalIntent: 'Tab exámenes sin primaria',
      hasDistinctClinicalIntent: true,
      dataComplexity: 'medium',
      existingTabId: 'exams',
      classicMode: true,
    });
    expect(result.verdict).toBe('REJECT');
    expect(result.rejectReasons.some((r) => r.includes('acción primaria'))).toBe(true);
  });

  it('10 — congelamiento clínico sin microfase → REJECT', () => {
    const result = proposeEpisScreen({
      id: 'clinical-freeze',
      clinicalIntent: 'Pantalla nueva en congelamiento',
      hasDistinctClinicalIntent: true,
      clinicalFreezeWithoutMicrophase: true,
      primaryAction: basePrimary,
    });
    expect(result.verdict).toBe('REJECT');
    expect(result.rejectReasons.some((r) => r.includes('Congelamiento'))).toBe(true);
  });
});
