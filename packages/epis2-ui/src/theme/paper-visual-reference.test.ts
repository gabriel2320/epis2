import { describe, expect, it } from 'vitest';
import {
  FICHAPAPEL_VISUAL_REFERENCE,
  epis2PaperCalmCanvasSx,
  epis2PaperToolbarControlSx,
} from './paper-visual-reference.js';
import { epis2ClinicalCalmCanvasColors } from './clinical/clinical-calm-canvas.js';

describe('paper-visual-reference FichaPapel', () => {
  it('expone metadata repo referencia', () => {
    expect(FICHAPAPEL_VISUAL_REFERENCE.repository).toContain('FichaPapel');
    expect(FICHAPAPEL_VISUAL_REFERENCE.mode).toBe('reference');
  });

  it('canvas Calm Premium usa THEME-CALM-01', () => {
    const calm = epis2PaperCalmCanvasSx() as Record<string, unknown>;
    expect(calm.bgcolor).toBe(epis2ClinicalCalmCanvasColors.light);
  });

  it('toolbar activo usa navy header', () => {
    const active = epis2PaperToolbarControlSx(true) as Record<string, unknown>;
    expect(active.bgcolor).toBe('#0d2b5e');
  });
});
