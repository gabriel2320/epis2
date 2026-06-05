import { describe, expect, it } from 'vitest';
import { createEpis2Theme } from './create-epis2-theme.js';

describe('createEpis2Theme dark mode', () => {
  it('activa palette oscura sin alterar roles clínicos', () => {
    const light = createEpis2Theme({ mode: 'light' });
    const dark = createEpis2Theme({ mode: 'dark' });

    expect(light.palette.mode).toBe('light');
    expect(dark.palette.mode).toBe('dark');
    expect(dark.palette.background?.default).not.toBe(light.palette.background?.default);
    expect(dark.epis2?.clinical.critical.main).toBe(light.epis2?.clinical.critical.main);
  });

  it('campos outlined usan background.paper en modo oscuro', () => {
    const dark = createEpis2Theme({ mode: 'dark' });
    const inputRoot = dark.components?.MuiOutlinedInput?.styleOverrides?.root;
    expect(typeof inputRoot).toBe('function');
    if (typeof inputRoot === 'function') {
      const styles = inputRoot({ theme: dark } as never);
      expect(styles).toMatchObject({
        backgroundColor: dark.palette.background.paper,
      });
    }
  });
});
