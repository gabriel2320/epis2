import { describe, expect, it } from 'vitest';
import { buildEpis2Shadows } from './visual-identity.js';

describe('epis2 elevation (THEME-06)', () => {
  it('escala MUI sin sombras proyectadas', () => {
    expect(buildEpis2Shadows('light').every((s) => s === 'none')).toBe(true);
    expect(buildEpis2Shadows('dark').every((s) => s === 'none')).toBe(true);
  });
});
