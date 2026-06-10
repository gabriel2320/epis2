import { describe, expect, it } from 'vitest';
import { evaluateExclusion, filterClinicalCandidates } from './exclusions.js';

describe('drug-intel exclusiones', () => {
  it('excluye homeopáticos por categoría de registro ISP', () => {
    const result = evaluateExclusion({
      name: 'Arnica Plus',
      sourceCategory: 'Medicamento Homeopático',
    });
    expect(result.excluded).toBe(true);
    if (result.excluded) expect(result.reason).toBe('homeopathic');
  });

  it('excluye homeopáticos por nombre (diluciones)', () => {
    const result = evaluateExclusion({ name: 'Belladonna homeopática CH 30' });
    expect(result.excluded).toBe(true);
    if (result.excluded) expect(result.reason).toBe('homeopathic');
  });

  it('excluye suplementos alimenticios', () => {
    const result = evaluateExclusion({ name: 'Omega 3 Suplemento Alimenticio' });
    expect(result.excluded).toBe(true);
    if (result.excluded) expect(result.reason).toBe('supplement');
  });

  it('excluye cosméticos por categoría y por nombre', () => {
    expect(
      evaluateExclusion({ name: 'Crema X', sourceCategory: 'Producto Cosmético' }).excluded,
    ).toBe(true);
    expect(evaluateExclusion({ name: 'Bloqueador solar FPS 50' }).excluded).toBe(true);
  });

  it('excluye sustancias de uso no clínico', () => {
    const result = evaluateExclusion({ name: 'Repelente de insectos familiar' });
    expect(result.excluded).toBe(true);
    if (result.excluded) expect(result.reason).toBe('non_clinical');
  });

  it('no excluye fármacos clínicos', () => {
    expect(evaluateExclusion({ name: 'Losartán 50 mg comprimidos' }).excluded).toBe(false);
    expect(evaluateExclusion({ name: 'Amoxicilina 500 mg cápsulas' }).excluded).toBe(false);
  });

  it('un ATC clínico válido pesa más que heurísticas de nombre', () => {
    // "Complejo vitamínico" se excluiría por nombre, pero B03BA01 es clínico
    // (cianocobalamina) y tiene prioridad.
    const result = evaluateExclusion({
      name: 'Complejo vitamínico B12 inyectable',
      atcCode: 'B03BA01',
    });
    expect(result.excluded).toBe(false);
  });

  it('excluye grupos ATC sin uso farmacológico clínico', () => {
    const result = evaluateExclusion({ name: 'Apósito quirúrgico', atcCode: 'V20AA' });
    expect(result.excluded).toBe(true);
    if (result.excluded) expect(result.reason).toBe('non_clinical');
  });

  it('filterClinicalCandidates separa incluidos y excluidos con razón', () => {
    const { included, excluded } = filterClinicalCandidates([
      { name: 'Paracetamol 500 mg' },
      { name: 'Flores de Bach Rescue' },
      { name: 'Shampoo anticaspa cosmético' },
    ]);
    expect(included.map((c) => c.name)).toEqual(['Paracetamol 500 mg']);
    expect(excluded).toHaveLength(2);
    expect(excluded.every((e) => e.result.excluded)).toBe(true);
  });
});
