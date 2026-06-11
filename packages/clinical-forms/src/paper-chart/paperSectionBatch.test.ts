import { describe, expect, it } from 'vitest';
import {
  PAPER_CHART_SECTIONS_VIII_XIV,
  assertPaperChartSectionsViiiXivInvariants,
  isPaperChartSectionViiiXiv,
} from './paperSectionBatch.js';

describe('paperSectionBatch (MF-PA-04)', () => {
  it('VIII–XIV son 7 secciones', () => {
    expect(assertPaperChartSectionsViiiXivInvariants()).toEqual([]);
    expect(PAPER_CHART_SECTIONS_VIII_XIV).toEqual([
      'nursing',
      'fluidBalance',
      'consults',
      'procedures',
      'imaging',
      'consent',
      'socialWork',
    ]);
  });

  it('detecta sección batch 2', () => {
    expect(isPaperChartSectionViiiXiv('nursing')).toBe(true);
    expect(isPaperChartSectionViiiXiv('cover')).toBe(false);
  });
});
