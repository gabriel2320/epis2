import { describe, expect, it } from 'vitest';
import { buildEpis2Components } from './components.js';

describe('buildEpis2Components motion', () => {
  it('modo reduced desactiva transiciones en botones', () => {
    const reduced = buildEpis2Components('reduced');
    const standard = buildEpis2Components('standard');
    expect(reduced.MuiButton?.styleOverrides?.root).toMatchObject({ transition: 'none' });
    expect(standard.MuiButton?.styleOverrides?.root).not.toMatchObject({ transition: 'none' });
  });
});
