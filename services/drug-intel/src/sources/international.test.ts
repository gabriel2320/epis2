import { describe, expect, it } from 'vitest';
import { parseOpenFdaLabel } from './openfda.js';
import { parseAtcClassResponse, parseRxcuiResponse } from './rxnorm.js';

describe('drug-intel fuentes internacionales', () => {
  it('parsea etiqueta OpenFDA con warnings y reacciones adversas', () => {
    const body = JSON.stringify({
      results: [
        {
          boxed_warning: ['FETAL TOXICITY: discontinue when pregnancy is detected.'],
          warnings: ['Hypotension may occur in volume-depleted patients.'],
          adverse_reactions: ['Dizziness, hyperkalemia, cough.'],
          dosage_and_administration: ['Adults: 50 mg once daily.'],
          openfda: { generic_name: ['LOSARTAN POTASSIUM'], brand_name: ['COZAAR'] },
        },
      ],
    });
    const label = parseOpenFdaLabel(body, 'https://api.fda.gov/drug/label.json?search=x');
    expect(label).not.toBeNull();
    expect(label).toMatchObject({
      genericName: 'LOSARTAN POTASSIUM',
      brandName: 'COZAAR',
      boxedWarning: expect.stringContaining('FETAL TOXICITY'),
      warnings: expect.stringContaining('Hypotension'),
      adverseReactions: expect.stringContaining('hyperkalemia'),
      dosageAndAdministration: expect.stringContaining('50 mg once daily'),
    });
  });

  it('devuelve null cuando OpenFDA no tiene resultados o el JSON es inválido', () => {
    expect(parseOpenFdaLabel(JSON.stringify({ results: [] }), 'u')).toBeNull();
    expect(parseOpenFdaLabel('not json', 'u')).toBeNull();
  });

  it('parsea rxcui de RxNorm', () => {
    expect(parseRxcuiResponse(JSON.stringify({ idGroup: { rxnormId: ['52175'] } }))).toBe('52175');
    expect(parseRxcuiResponse(JSON.stringify({ idGroup: {} }))).toBeNull();
    expect(parseRxcuiResponse('not json')).toBeNull();
  });

  it('parsea clases ATC desde RxClass y deduplica', () => {
    const body = JSON.stringify({
      rxclassDrugInfoList: {
        rxclassDrugInfo: [
          { rxclassMinConceptItem: { classId: 'C09CA01', classType: 'ATC1-4' } },
          { rxclassMinConceptItem: { classId: 'C09CA01', classType: 'ATC1-4' } },
          { rxclassMinConceptItem: { classId: 'X999', classType: 'MOA' } },
        ],
      },
    });
    expect(parseAtcClassResponse(body)).toEqual(['C09CA01']);
    expect(parseAtcClassResponse('not json')).toEqual([]);
  });
});
