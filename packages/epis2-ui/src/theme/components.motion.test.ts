import { describe, expect, it } from 'vitest';
import type { Theme } from '@mui/material/styles';
import { buildEpis2Components } from './components.js';

const mockTheme = {
  palette: {
    mode: 'light',
    primary: { main: '#1873DC', light: '#E3F0FF', dark: '#0D5BB5', contrastText: '#fff' },
    divider: '#DCE4F0',
  },
  epis2: {
    visual: {
      brandGradient: 'linear-gradient(135deg, #1873DC, #0EA5E9)',
      cardBorder: 'rgba(148, 163, 184, 0.32)',
      powerBarFocusShadow: '0 0 0 4px rgba(24, 115, 220, 0.1)',
      powerBarBorder: 'rgba(24, 115, 220, 0.18)',
    },
  },
  shadows: ['none', '0 1px 2px rgba(0,0,0,0.05)'],
} as Theme;

describe('buildEpis2Components motion', () => {
  it('modo reduced desactiva transiciones en botones', () => {
    const reduced = buildEpis2Components('reduced');
    const standard = buildEpis2Components('standard');
    const reducedRoot = reduced.MuiButton?.styleOverrides?.root;
    const standardRoot = standard.MuiButton?.styleOverrides?.root;
    expect(typeof reducedRoot).toBe('function');
    expect(typeof standardRoot).toBe('function');
    expect((reducedRoot as (p: { theme: Theme }) => object)({ theme: mockTheme })).toMatchObject({
      transition: 'none',
    });
    expect((standardRoot as (p: { theme: Theme }) => object)({ theme: mockTheme })).not.toMatchObject({
      transition: 'none',
    });
  });
});
