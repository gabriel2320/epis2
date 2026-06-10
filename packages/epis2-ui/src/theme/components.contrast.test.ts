import { describe, expect, it } from 'vitest';
import type { Theme } from '@mui/material/styles';
import { createEpis2Theme } from './create-epis2-theme.js';
import { buildEpis2Components } from './components.js';

function hexToRgb(hex: string) {
  const n = hex.replace('#', '');
  return {
    r: parseInt(n.slice(0, 2), 16) / 255,
    g: parseInt(n.slice(2, 4), 16) / 255,
    b: parseInt(n.slice(4, 6), 16) / 255,
  };
}

function relativeLuminance(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  const linear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

function contrastRatio(fg: string, bg: string) {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('buildEpis2Components contained contrast', () => {
  it('botones contained usan contrastText sobre fondos de color', () => {
    const theme = createEpis2Theme({ mode: 'light', accent: 'clinicalBlue' });
    const components = buildEpis2Components('standard');
    const root = components.MuiButton?.styleOverrides?.root;
    expect(typeof root).toBe('function');

    const styles = (root as (p: { theme: Theme }) => Record<string, unknown>)({ theme });
    const primaryRule = styles['&.MuiButton-containedPrimary'] as Record<string, string>;
    expect(primaryRule.color).toBe(theme.palette.primary.contrastText);
    expect(contrastRatio(primaryRule.color, primaryRule.backgroundColor)).toBeGreaterThanOrEqual(
      4.5,
    );
  });

  it('chips filledPrimary usan contrastText', () => {
    const theme = createEpis2Theme({ mode: 'light', accent: 'clinicalBlue' });
    const components = buildEpis2Components('standard');
    const root = components.MuiChip?.styleOverrides?.root;
    const styles = (root as (p: { theme: Theme }) => Record<string, unknown>)({ theme });
    const primaryChip = styles['&.MuiChip-filledPrimary'] as Record<string, string>;
    expect(primaryChip.color).toBe(theme.palette.primary.contrastText);
  });
});
