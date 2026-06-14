import { describe, expect, it } from 'vitest';
import { epis2PaperChartCssVars, epis2PaperChartTokens } from './chart-modes-tokens.js';

describe('epis2PaperChartTokens MF-PAPER-01', () => {
  it('usa marfil cálido FichaPapel y grilla basal carta 6mm', () => {
    expect(epis2PaperChartTokens.paperBg).toBe('#fdfcf7');
    expect(epis2PaperChartTokens.baselineMmLetter).toBe(6);
    expect(epis2PaperChartTokens.baselineMmA5).toBe(5.5);
  });

  it('expone variables CSS para hoja carta', () => {
    const vars = epis2PaperChartCssVars('letter');
    expect(vars['--epis2-paper-bg']).toBe('#fdfcf7');
    expect(vars['--epis2-paper-baseline']).toBe('6mm');
    expect(vars['--epis2-paper-ruled-line']).toBe('#d8d4cc');
  });

  it('baseline A5 en css vars', () => {
    const vars = epis2PaperChartCssVars('a5');
    expect(vars['--epis2-paper-baseline']).toBe('5.5mm');
  });
});
