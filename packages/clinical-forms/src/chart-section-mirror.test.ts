import { describe, expect, it } from 'vitest';
import {
  assertChartSectionMirrorInvariants,
  assertChartMirrorBatch1Bindings,
  assertChartMirrorBatch2Bindings,
  getMirrorBindingForPaperSection,
  getMirrorBindingForTraditionalSection,
} from './chart-section-mirror.js';

describe('chart-section-mirror (MF-NORM-01)', () => {
  it('invariantes nav ↔ bindings', () => {
    expect(assertChartSectionMirrorInvariants()).toEqual([]);
  });

  it('alergias y labs enlazan a sección papel', () => {
    expect(getMirrorBindingForTraditionalSection('navAllergies')?.paperSectionId).toBe('cover');
    expect(getMirrorBindingForTraditionalSection('navLabs')?.paperSectionId).toBe('labs');
  });

  it('resumen y auditoría solo electrónica', () => {
    expect(getMirrorBindingForTraditionalSection('navSummary')?.paperSectionId).toBeNull();
    expect(getMirrorBindingForTraditionalSection('navAudit')?.paperSectionId).toBeNull();
  });

  it('orders enlaza meds y órdenes', () => {
    const ordersPaper = getMirrorBindingForPaperSection('orders');
    expect(ordersPaper.map((b) => b.traditionalSectionId).sort()).toEqual(['navMeds', 'navOrders']);
  });

  it('batch1 espejo enlaza a papel', () => {
    expect(assertChartMirrorBatch1Bindings()).toEqual([]);
    expect(getMirrorBindingForTraditionalSection('navLabs')?.paperSectionId).toBe('labs');
  });

  it('batch2 espejo enlaza a papel', () => {
    expect(assertChartMirrorBatch2Bindings()).toEqual([]);
    expect(getMirrorBindingForTraditionalSection('navAnamnesis')?.paperSectionId).toBe('anamnesis');
    expect(getMirrorBindingForTraditionalSection('navConsults')?.paperSectionId).toBe('consults');
  });
});
