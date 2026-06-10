import { describe, expect, it } from 'vitest';
import {
  buildRecord,
  matchAlerts,
  priceMatchesProduct,
  recordContentHash,
  slugifyProductName,
  type NormalizeInput,
} from './normalize.js';

const baseInput: NormalizeInput = {
  isp: {
    registryId: 'F-12345/20',
    name: 'LOSARTÁN POTÁSICO 50 mg COMPRIMIDOS',
    activeIngredient: 'Losartán potásico',
    pharmaceuticalForm: 'Comprimido recubierto',
    saleCondition: 'Receta médica',
    status: 'Vigente',
    holder: 'Laboratorio Chile',
  },
  ispAlerts: [
    { title: 'Alerta de seguridad: retiro de lote de losartán 50 mg' },
    { title: 'Suspensión de productos con ranitidina' },
  ],
  prices: [
    {
      productName: 'Losartan potasico 50 mg x 30',
      price: {
        amountClp: 3490,
        currency: 'CLP',
        source: 'tufarmacia.gob.cl (MINSAL)',
        fetchedAt: '2026-06-10T00:00:00.000Z',
        referential: true,
      },
    },
    {
      productName: 'Metformina 850 mg',
      price: {
        amountClp: 1990,
        currency: 'CLP',
        source: 'CENABAST',
        fetchedAt: '2026-06-10T00:00:00.000Z',
        referential: true,
      },
    },
  ],
  openFda: {
    sourceUrl: 'https://api.fda.gov/drug/label.json?search=losartan',
    boxedWarning: 'FETAL TOXICITY',
    warnings: 'Hypotension risk',
    adverseReactions: 'Dizziness, hyperkalemia',
    dosageAndAdministration: 'Adults: 50 mg once daily',
  },
  rxNorm: { rxcui: '52175', atcCodes: ['C09CA01'], sources: [], failures: [] },
  sources: [
    'https://registrosanitario.ispch.gob.cl',
    'https://api.fda.gov/drug/label.json?search=losartan',
  ],
  fetchedAt: '2026-06-10T12:00:00.000Z',
};

describe('drug-intel normalización', () => {
  it('slugifica nombres con acentos y símbolos', () => {
    expect(slugifyProductName('Losartán Potásico 50 mg')).toBe('losartan-potasico-50-mg');
  });

  it('matchea precios al producto de forma laxa', () => {
    expect(priceMatchesProduct('LOSARTÁN POTÁSICO 50 mg', 'Losartan potasico 50 mg x 30')).toBe(
      true,
    );
    expect(priceMatchesProduct('LOSARTÁN POTÁSICO 50 mg', 'Metformina 850 mg')).toBe(false);
  });

  it('asocia solo alertas ISP relevantes al producto', () => {
    const alerts = matchAlerts(baseInput.isp, baseInput.ispAlerts);
    expect(alerts).toHaveLength(1);
    expect(alerts[0]!.title).toContain('losartán');
  });

  it('construye un registro canónico válido con todas las fuentes', () => {
    const record = buildRecord(baseInput);
    expect(record.recordKey).toBe('isp-f-12345-20');
    expect(record.productName).toBe('LOSARTÁN POTÁSICO 50 mg COMPRIMIDOS');
    expect(record.activeIngredient).toBe('Losartán potásico');
    expect(record.atcCode).toBe('C09CA01');
    expect(record.ispRegistry).toMatchObject({
      registryId: 'F-12345/20',
      saleCondition: 'Receta médica',
    });
    expect(record.pharmaceuticalForms).toEqual(['Comprimido recubierto']);
    expect(record.prices).toHaveLength(1);
    expect(record.prices[0]!.amountClp).toBe(3490);
    expect(record.warnings.map((w) => w.source)).toEqual([
      'openfda:boxed_warning',
      'openfda:warnings',
    ]);
    expect(record.adverseReactions[0]!.text).toContain('hyperkalemia');
    expect(record.recommendedDoses[0]!.text).toContain('50 mg once daily');
    expect(record.ispAlerts).toHaveLength(1);
    expect(record.correlation.status).toBe('not_correlated');
    expect(record.correlation.requiresHumanReview).toBe(true);
  });

  it('construye registro mínimo sin fuentes internacionales', () => {
    const record = buildRecord({
      ...baseInput,
      isp: { registryId: 'F-1/20', name: 'Producto Simple' },
      openFda: undefined,
      rxNorm: undefined,
      prices: [],
      ispAlerts: [],
    });
    expect(record.activeIngredient).toBeUndefined();
    expect(record.atcCode).toBeUndefined();
    expect(record.warnings).toEqual([]);
    expect(record.prices).toEqual([]);
  });

  it('hash de contenido es estable e ignora fetchedAt/correlation', () => {
    const a = buildRecord(baseInput);
    const b = buildRecord({ ...baseInput, fetchedAt: '2026-06-11T08:00:00.000Z' });
    expect(recordContentHash(a)).toBe(recordContentHash(b));

    const c = buildRecord({
      ...baseInput,
      isp: { ...baseInput.isp, name: 'OTRO PRODUCTO' },
    });
    expect(recordContentHash(a)).not.toBe(recordContentHash(c));
  });
});
