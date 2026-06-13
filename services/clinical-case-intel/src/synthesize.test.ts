import { describe, expect, it } from 'vitest';
import type { ClinicalCaseRecord } from '@epis2/contracts';
import { SYNTHESIZE_PROMPT_VERSION } from './normalize.js';
import {
  applySynthesizeOutput,
  buildSynthesizePrompt,
  parseSynthesizeOutput,
  synthesizeRecord,
  synthesizeOutputSchema,
} from './synthesize.js';
import { filterValidRecords } from './validate.js';

const baseRecord: ClinicalCaseRecord = {
  caseCode: 'SIM-HTA-0001',
  tier: 'L0_synthetic',
  provenance: {
    sourceType: 'scraped',
    sourceName: 'synthea',
    license: 'CC0-1.0',
    scrapedAt: '2026-06-12T12:00:00.000Z',
    externalPatientId: 'test-patient',
  },
  patient: {
    displayName: 'Paciente Sim — Test',
    birthDate: '1978-04-15',
    sex: 'F',
    isSynthetic: true,
  },
  clinical: {
    scenario: 'Hipertensión arterial esencial (sintético)',
    problems: ['Hipertensión arterial esencial (sintético)'],
    observations: [{ label: 'PA', valueText: '142/88 mmHg (sintético)' }],
    medications: [{ name: 'Losartan (demo)', doseText: '50 mg/día', status: 'active' }],
  },
  epis2Mapping: {
    encounterStatus: 'open',
    summaryFields: {
      activeProblems: 'HTA',
      recentEvents: 'Últimas 24 h: evolución estable (sintético)',
      relevantLabs: 'PA 142/88',
      activeMedications: 'Losartan',
      pendingItems: 'Control en 7 días',
      clinicalAlerts: 'SIM / SINTÉTICO — sin alertas reales',
    },
    identifierSystem: 'EPIS2-SIM',
  },
  evolabHints: {
    capabilities: ['evolution_note'],
    suggestedGoals: ['create_evolution_note'],
    risk: 'low',
  },
  generation: {
    promptVersion: 'mf-case-01-synthea-v1',
    requiresHumanReview: true,
    contentHash: 'seed',
  },
  fetchedAt: '2026-06-12T12:00:00.000Z',
};

describe('clinical-case-intel synthesize', () => {
  it('prompt incluye problemas y reglas de borrador', () => {
    const prompt = buildSynthesizePrompt(baseRecord);
    expect(prompt).toContain('Hipertensión');
    expect(prompt).toContain('NO prescribas');
    expect(prompt).toContain('sintético');
  });

  it('fusiona salida IA y marca provenance hybrid', () => {
    const output = synthesizeOutputSchema.parse({
      scenario: 'Control ambulatorio por cifras tensionales elevadas',
      recentEvents: 'Refiere cefalea leve matutina',
      pendingItems: 'Repetir MAPA en una semana',
      suggestedCapabilities: ['evolution_note', 'lab_request'],
      risk: 'low',
    });
    const enriched = applySynthesizeOutput(baseRecord, output, 'qwen3:8b');
    expect(enriched.provenance.sourceType).toBe('hybrid');
    expect(enriched.generation.promptVersion).toBe(SYNTHESIZE_PROMPT_VERSION);
    expect(enriched.generation.model).toBe('qwen3:8b');
    expect(enriched.clinical.scenario).toContain('sintético');
    expect(enriched.epis2Mapping.summaryFields.recentEvents).toContain('cefalea');
    expect(enriched.evolabHints?.capabilities).toContain('lab_request');
    expect(filterValidRecords([enriched]).valid).toHaveLength(1);
  });

  it('añade marca sintético si la IA la omite', () => {
    const output = synthesizeOutputSchema.parse({
      scenario: 'Paciente en control de presión arterial',
      recentEvents: 'Sin síntomas agudos',
      pendingItems: 'Control rutinario',
    });
    const enriched = applySynthesizeOutput(baseRecord, output, 'test-model');
    expect(enriched.clinical.scenario.toLowerCase()).toMatch(/sintético|sintetico/);
  });

  it('normaliza arrays de Ollama a texto', () => {
    const parsed = parseSynthesizeOutput({
      scenario: ['Control ambulatorio', 'HTA estable'],
      recentEvents: ['Sin síntomas agudos'],
      pendingItems: 'Control en 7 días',
    });
    expect(parsed?.scenario).toContain('Control ambulatorio');
    expect(parsed?.recentEvents).toContain('Sin síntomas agudos');
  });

  it('degrada sin cambios cuando el cliente falla', async () => {
    const result = await synthesizeRecord(baseRecord, {
      async generate() {
        return { ok: false, reason: 'Ollama offline' };
      },
    });
    expect(result.ok).toBe(false);
    expect(result.record).toEqual(baseRecord);
  });

  it('enriquece con cliente mock', async () => {
    const result = await synthesizeRecord(baseRecord, {
      async generate() {
        return {
          ok: true,
          model: 'mock-model',
          json: {
            scenario: 'Seguimiento de HTA en atención primaria (demo)',
            recentEvents: 'Adherencia parcial al tratamiento (sintético)',
            pendingItems: 'Laboratorio de control en 3 meses (demo)',
            suggestedCapabilities: ['evolution_note', 'prescription'],
            risk: 'low',
          },
        };
      },
    });
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.record.provenance.sourceType).toBe('hybrid');
      expect(result.record.generation.model).toBe('mock-model');
    }
  });
});
