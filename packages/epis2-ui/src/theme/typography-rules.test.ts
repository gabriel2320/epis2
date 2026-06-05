import { describe, expect, it } from 'vitest';
import {
  epis2ClinicalProseSx,
  epis2GridUnit,
  epis2InteractionDuration,
  epis2LineHeight,
  epis2NumericCellSx,
  epis2ProseMaxWidth,
  epis2TabularNumsSx,
  epis2TypeScale,
} from './typography-rules.js';

describe('epis2 typography rules', () => {
  it('escala modular sobre base 14px', () => {
    expect(epis2TypeScale.basePx).toBe(14);
    expect(epis2TypeScale.ratio).toBe(1.2);
    expect(epis2TypeScale.body).toBe('0.875rem');
  });

  it('prosa clínica entre 45 y 75 caracteres', () => {
    expect(epis2ProseMaxWidth).toBe('65ch');
    expect(epis2ClinicalProseSx).toMatchObject({
      maxWidth: '65ch',
      lineHeight: 1.5,
      textAlign: 'left',
    });
  });

  it('interlineado de encabezados y cuerpo', () => {
    expect(epis2LineHeight.body).toBe(1.5);
    expect(epis2LineHeight.heading).toBe(1.2);
  });

  it('números tabulares y alineación derecha en tablas', () => {
    expect(epis2TabularNumsSx).toMatchObject({ fontVariantNumeric: 'tabular-nums' });
    expect(epis2NumericCellSx).toMatchObject({
      fontVariantNumeric: 'tabular-nums',
      textAlign: 'right',
    });
  });

  it('grid 8pt y duración de interacción', () => {
    expect(epis2GridUnit).toBe(8);
    expect(epis2InteractionDuration.min).toBeGreaterThanOrEqual(150);
    expect(epis2InteractionDuration.max).toBeLessThanOrEqual(300);
  });
});
