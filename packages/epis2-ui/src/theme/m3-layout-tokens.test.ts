import { describe, expect, it } from 'vitest';
import {
  epis2ClinicalFormFooterSx,
  epis2M3FormColumns,
  epis2M3FormLayout,
  epis2M3GridUnitPx,
  epis2M3Spacing,
  epis2M3TouchTargetMinPx,
  epis2M3ColumnSpanSx,
  resolveEpis2M3FormLayout,
} from './m3-layout-tokens.js';

describe('epis2 M3 layout tokens', () => {
  it('cuadrícula base 8dp', () => {
    expect(epis2M3GridUnitPx).toBe(8);
  });

  it('escala de espaciado en múltiplos de 4/8', () => {
    expect(epis2M3Spacing.fine * epis2M3GridUnitPx).toBe(4);
    expect(epis2M3Spacing.tight * epis2M3GridUnitPx).toBe(8);
    expect(epis2M3Spacing.row * epis2M3GridUnitPx).toBe(16);
    expect(epis2M3Spacing.block * epis2M3GridUnitPx).toBe(24);
    expect(epis2M3Spacing.section * epis2M3GridUnitPx).toBe(32);
  });

  it('ritmo vertical de formulario clínico', () => {
    expect(epis2M3FormLayout.fieldRowGap).toBe(epis2M3Spacing.row);
    expect(epis2M3FormLayout.sectionGap).toBe(epis2M3Spacing.block);
    expect(epis2M3FormLayout.columns).toBe(12);
    expect(epis2M3FormColumns).toBe(12);
  });

  it('densidad compacta reduce sectionGap', () => {
    expect(resolveEpis2M3FormLayout('compact').sectionGap).toBe(epis2M3Spacing.row);
    expect(resolveEpis2M3FormLayout('comfortable').sectionGap).toBe(epis2M3Spacing.block);
  });

  it('touch target mínimo 48dp', () => {
    expect(epis2M3TouchTargetMinPx).toBe(48);
    expect(epis2M3TouchTargetMinPx % epis2M3GridUnitPx).toBe(0);
  });

  it('footer de formulario alineado a la derecha con gap 8dp', () => {
    expect(epis2ClinicalFormFooterSx).toMatchObject({
      justifyContent: 'flex-end',
      gap: epis2M3Spacing.tight,
    });
  });

  it('column span acota entre 1 y 12', () => {
    expect(epis2M3ColumnSpanSx(0)).toMatchObject({
      gridColumn: { xs: 'span 12', sm: 'span 1' },
    });
    expect(epis2M3ColumnSpanSx(4)).toMatchObject({
      gridColumn: { xs: 'span 12', sm: 'span 4' },
    });
    expect(epis2M3ColumnSpanSx(99)).toMatchObject({
      gridColumn: { xs: 'span 12', sm: 'span 12' },
    });
  });
});
