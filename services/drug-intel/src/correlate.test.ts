import { describe, expect, it } from 'vitest';
import type { DrugIntelRecord } from '@epis2/contracts';
import { correlateRecord, deterministicDiscrepancies } from './correlate.js';

function makeRecord(overrides: Partial<DrugIntelRecord> = {}): DrugIntelRecord {
  return {
    recordKey: 'isp-f-12345-20',
    productName: 'LOSARTÁN POTÁSICO 50 mg',
    activeIngredient: 'Losartán potásico',
    atcCode: 'C09CA01',
    pharmaceuticalForms: ['Comprimido'],
    recommendedDoses: [{ population: 'unspecified', text: '50 mg/día', source: 'openfda' }],
    prices: [
      {
        amountClp: 3490,
        currency: 'CLP',
        source: 'tufarmacia.gob.cl (MINSAL)',
        fetchedAt: '2026-06-10T00:00:00.000Z',
        referential: true,
      },
    ],
    warnings: [{ text: 'Hypotension risk', source: 'openfda:warnings' }],
    ispAlerts: [],
    adverseReactions: [{ text: 'Dizziness', source: 'openfda:adverse_reactions' }],
    sources: ['https://registrosanitario.ispch.gob.cl'],
    correlation: { status: 'not_correlated', requiresHumanReview: true, discrepancies: [] },
    fetchedAt: '2026-06-10T12:00:00.000Z',
    ...overrides,
  };
}

describe('drug-intel correlación determinística', () => {
  it('registro completo y sin alertas no genera discrepancias', () => {
    expect(deterministicDiscrepancies(makeRecord())).toEqual([]);
  });

  it('marca warning si falta principio activo', () => {
    const record = makeRecord();
    delete (record as Partial<DrugIntelRecord>).activeIngredient;
    delete (record as Partial<DrugIntelRecord>).atcCode;
    const discrepancies = deterministicDiscrepancies(record);
    expect(
      discrepancies.some((d) => d.field === 'activeIngredient' && d.severity === 'warning'),
    ).toBe(true);
  });

  it('marca critical cuando hay alertas ISP vigentes', () => {
    const record = makeRecord({ ispAlerts: [{ title: 'Retiro de lote' }] });
    const discrepancies = deterministicDiscrepancies(record);
    expect(discrepancies.some((d) => d.field === 'ispAlerts' && d.severity === 'critical')).toBe(
      true,
    );
  });

  it('marca critical cuando la etiqueta FDA tiene boxed warning', () => {
    const record = makeRecord({
      warnings: [{ text: 'FETAL TOXICITY', source: 'openfda:boxed_warning' }],
    });
    const discrepancies = deterministicDiscrepancies(record);
    expect(discrepancies.some((d) => d.message.includes('boxed warning'))).toBe(true);
  });

  it('marca warning si no hay dosis ni etiqueta internacional', () => {
    const record = makeRecord({ recommendedDoses: [], warnings: [], adverseReactions: [] });
    const fields = deterministicDiscrepancies(record).map((d) => d.field);
    expect(fields).toContain('recommendedDoses');
    expect(fields).toContain('warnings');
  });
});

describe('drug-intel correlateRecord (sin Ollama)', () => {
  it('registro consistente queda consistent y sin revisión forzada', async () => {
    const result = await correlateRecord(makeRecord());
    expect(result.correlation.status).toBe('consistent');
    expect(result.correlation.requiresHumanReview).toBe(false);
    expect(result.correlation.correlatedAt).toBeDefined();
    expect(result.correlation.aiModel).toBeUndefined();
  });

  it('registro con discrepancias exige revisión humana', async () => {
    const result = await correlateRecord(makeRecord({ recommendedDoses: [], prices: [] }));
    expect(result.correlation.status).toBe('discrepant');
    expect(result.correlation.requiresHumanReview).toBe(true);
    expect(result.correlation.discrepancies.length).toBeGreaterThan(0);
  });
});
